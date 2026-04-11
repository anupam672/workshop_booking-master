from rest_framework import serializers
from django.contrib.auth.models import User
from workshop_app.models import Profile, WorkshopType, Workshop, Comment, AttachmentFile
from django.utils import timezone
from datetime import timedelta
import uuid


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = Profile
        fields = [
            'id', 'title', 'institute', 'department', 'phone_number',
            'position', 'how_did_you_hear_about_us', 'location', 'state',
            'is_email_verified'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration with profile"""
    profile = ProfileSerializer(required=True)
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'password2', 'profile']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        return data

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        validated_data.pop('password2')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        # Generate activation key
        activation_key = str(uuid.uuid4())
        key_expiry = timezone.now() + timedelta(days=7)

        Profile.objects.create(
            user=user,
            activation_key=activation_key,
            key_expiry_time=key_expiry,
            **profile_data
        )

        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    profile = ProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'profile']


class UserSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for user (name and email only)"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    class Meta:
        model = Profile
        fields = [
            'title', 'institute', 'department', 'phone_number',
            'position', 'how_did_you_hear_about_us', 'location', 'state'
        ]


class AttachmentFileSerializer(serializers.ModelSerializer):
    """Serializer for attachment files"""
    class Meta:
        model = AttachmentFile
        fields = ['id', 'attachments', 'workshop_type']


class WorkshopTypeSerializer(serializers.ModelSerializer):
    """Serializer for workshop types"""
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration', 'terms_and_conditions', 'attachments']

    def get_attachments(self, obj):
        attachments = obj.attachmentfile_set.all()
        return AttachmentFileSerializer(attachments, many=True).data


class WorkshopTypeSimpleSerializer(serializers.ModelSerializer):
    """Simple serializer for workshop type (without attachments)"""
    class Meta:
        model = WorkshopType
        fields = ['id', 'name', 'description', 'duration']


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for workshop comments"""
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_email = serializers.EmailField(source='author.email', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'author', 'author_name', 'author_email', 'comment', 'public', 'created_date']
        read_only_fields = ['id', 'author', 'author_name', 'author_email', 'created_date']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


class WorkshopListSerializer(serializers.ModelSerializer):
    """Serializer for listing workshops"""
    coordinator_name = serializers.CharField(source='coordinator.get_full_name', read_only=True)
    instructor_name = serializers.CharField(source='instructor.get_full_name', read_only=True, allow_null=True)
    workshop_type_name = serializers.CharField(source='workshop_type.name', read_only=True)
    status_display = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'coordinator', 'coordinator_name', 'instructor', 'instructor_name',
            'workshop_type', 'workshop_type_name', 'date', 'status', 'status_display', 'tnc_accepted'
        ]


class WorkshopDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for workshop"""
    coordinator = UserSerializer(read_only=True)
    instructor = UserSerializer(read_only=True, allow_null=True)
    workshop_type = WorkshopTypeSerializer(read_only=True)
    comments = CommentSerializer(source='comment_set', many=True, read_only=True)
    status_display = serializers.CharField(source='get_status', read_only=True)

    class Meta:
        model = Workshop
        fields = [
            'id', 'uid', 'coordinator', 'instructor', 'workshop_type',
            'date', 'status', 'status_display', 'tnc_accepted', 'comments'
        ]
        read_only_fields = ['id', 'uid', 'status', 'comments']


class WorkshopCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating workshops"""
    class Meta:
        model = Workshop
        fields = ['workshop_type', 'date', 'tnc_accepted']

    def validate_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Workshop date cannot be in the past.")
        return value

    def create(self, validated_data):
        validated_data['coordinator'] = self.context['request'].user
        return super().create(validated_data)


class WorkshopChangeDateSerializer(serializers.Serializer):
    """Serializer for changing workshop date"""
    new_date = serializers.DateField()

    def validate_new_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Workshop date cannot be in the past.")
        return value


class WorkshopAcceptSerializer(serializers.Serializer):
    """Serializer for accepting workshop"""
    pass


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password_confirm = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({'new_password': "Passwords do not match."})
        return data


class StatisticsSerializer(serializers.Serializer):
    """Serializer for statistics data"""
    total_workshops = serializers.IntegerField()
    accepted_workshops = serializers.IntegerField()
    pending_workshops = serializers.IntegerField()
    states_data = serializers.DictField()
    types_data = serializers.DictField()
