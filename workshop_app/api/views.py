from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from workshop_app.models import Profile, WorkshopType, Workshop, Comment, AttachmentFile
from .serializers import (
    UserRegistrationSerializer, UserSerializer, ProfileUpdateSerializer,
    WorkshopTypeSerializer, WorkshopListSerializer, WorkshopDetailSerializer,
    WorkshopCreateUpdateSerializer, WorkshopChangeDateSerializer, CommentSerializer,
    WorkshopTypeSimpleSerializer, ChangePasswordSerializer
)


class RegisterView(APIView):
    """
    User registration endpoint
    POST /api/auth/register/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile = user.profile

            # Send activation email
            self.send_activation_email(user, profile.activation_key)

            return Response({
                'message': 'Registration successful. Activation email sent.',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_activation_email(self, user, activation_key):
        """Send activation email to user"""
        subject = 'Activate your FOSSEE Workshop Booking Account'
        message = f"""
        Hi {user.first_name},

        Click the link below to activate your account:
        {settings.PRODUCTION_URL}/api/auth/activate/{activation_key}/

        This link will expire in 7 days.

        Best regards,
        FOSSEE Team
        """
        try:
            send_mail(
                subject,
                message,
                settings.SENDER_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {e}")


class ActivateAccountView(APIView):
    """
    Activate user account via email link
    GET /api/auth/activate/<key>/
    """
    permission_classes = [AllowAny]

    def get(self, request, activation_key):
        try:
            profile = Profile.objects.get(activation_key=activation_key)

            # Check if key is expired
            if profile.key_expiry_time < timezone.now():
                return Response({
                    'error': 'Activation link has expired.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Activate user
            profile.is_email_verified = True
            profile.activation_key = None
            profile.key_expiry_time = None
            profile.save()

            return Response({
                'message': 'Account activated successfully. You can now login.'
            }, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({
                'error': 'Invalid activation link.'
            }, status=status.HTTP_404_NOT_FOUND)


class LoginView(TokenObtainPairView):
    """
    User login endpoint
    POST /api/auth/login/
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            user = User.objects.get(username=request.data.get('username'))
            response.data['user'] = UserSerializer(user).data
        return response


class LogoutView(APIView):
    """
    User logout endpoint
    POST /api/auth/logout/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({
                    'message': 'Logout successful.'
                }, status=status.HTTP_200_OK)
            return Response({
                'error': 'Refresh token required.'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class RefreshTokenView(TokenRefreshView):
    """
    Refresh access token
    POST /api/auth/token/refresh/
    """
    permission_classes = [AllowAny]


class ProfileView(APIView):
    """
    Get current user profile
    GET /api/profile/me/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = request.user.profile
            return Response({
                'user': UserSerializer(request.user).data,
                'profile': profile
            }, status=status.HTTP_200_OK)
        except Profile.DoesNotExist:
            return Response({
                'error': 'Profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class ProfileUpdateView(APIView):
    """
    Update current user profile
    PATCH /api/profile/me/
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            profile = request.user.profile
            serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'message': 'Profile updated successfully.',
                    'profile': serializer.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response({
                'error': 'Profile not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class ChangePasswordView(APIView):
    """
    Change user password
    POST /api/profile/change-password/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({
                    'error': 'Old password is incorrect.'
                }, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password changed successfully.'
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileDetailView(APIView):
    """
    Get detailed profile of another user (instructors only)
    GET /api/profile/<user_id>/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # Check if requester is instructor
        if request.user.profile.position != 'instructor':
            return Response({
                'error': 'Only instructors can view other profiles.'
            }, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(id=user_id)
            return Response({
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found.'
            }, status=status.HTTP_404_NOT_FOUND)


class WorkshopTypeViewSet(viewsets.ModelViewSet):
    """
    Workshop Type Endpoints
    GET    /api/workshop-types/           - List all types
    POST   /api/workshop-types/           - Create (instructor only)
    GET    /api/workshop-types/<id>/      - Detail
    PATCH  /api/workshop-types/<id>/      - Update (instructor only)
    """
    queryset = WorkshopType.objects.all()
    serializer_class = WorkshopTypeSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """Allow anyone to view, only instructors to create/update"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        """Only instructors can create workshop types"""
        if self.request.user.profile.position != 'instructor':
            raise PermissionError("Only instructors can create workshop types.")
        serializer.save()

    def perform_update(self, serializer):
        """Only instructors can update workshop types"""
        if self.request.user.profile.position != 'instructor':
            raise PermissionError("Only instructors can update workshop types.")
        serializer.save()

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def tnc(self, request, pk=None):
        """
        Get terms and conditions for workshop type
        GET /api/workshop-types/<id>/tnc/
        """
        workshop_type = self.get_object()
        return Response({
            'id': workshop_type.id,
            'name': workshop_type.name,
            'terms_and_conditions': workshop_type.terms_and_conditions
        }, status=status.HTTP_200_OK)


class WorkshopViewSet(viewsets.ModelViewSet):
    """
    Workshop Endpoints
    GET    /api/workshops/                - List (role-based filtering)
    POST   /api/workshops/                - Create proposal (coordinator only)
    GET    /api/workshops/<id>/           - Detail
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter workshops based on user role"""
        user = self.request.user
        if user.profile.position == 'instructor':
            # Instructors see workshops assigned to them
            return Workshop.objects.filter(instructor=user)
        else:
            # Coordinators see their own workshop proposals
            return Workshop.objects.filter(coordinator=user)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return WorkshopDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return WorkshopCreateUpdateSerializer
        return WorkshopListSerializer

    def perform_create(self, serializer):
        """Only coordinators can create workshops"""
        if self.request.user.profile.position != 'coordinator':
            raise PermissionError("Only coordinators can propose workshops.")
        serializer.save()

    def list(self, request, *args, **kwargs):
        """
        List workshops with optional filtering
        Query params: status, date_from, date_to
        """
        queryset = self.get_queryset()

        # Filter by status
        status_param = request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filter by date range
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def accept(self, request, pk=None):
        """
        Accept a workshop proposal (instructor only)
        POST /api/workshops/<id>/accept/
        """
        workshop = self.get_object()

        # Check if requester is instructor
        if request.user.profile.position != 'instructor':
            return Response({
                'error': 'Only instructors can accept workshops.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Check if workshop is in pending state
        if workshop.status != 0:
            return Response({
                'error': 'Only pending workshops can be accepted.'
            }, status=status.HTTP_400_BAD_REQUEST)

        workshop.instructor = request.user
        workshop.status = 1
        workshop.save()

        return Response({
            'message': 'Workshop accepted successfully.',
            'workshop': WorkshopDetailSerializer(workshop).data
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def change_date(self, request, pk=None):
        """
        Propose a date change for workshop
        POST /api/workshops/<id>/change-date/
        """
        workshop = self.get_object()
        serializer = WorkshopChangeDateSerializer(data=request.data)

        if serializer.is_valid():
            new_date = serializer.validated_data['new_date']

            # Check if requester is coordinator or instructor of this workshop
            if request.user !=  workshop.coordinator and request.user != workshop.instructor:
                return Response({
                    'error': 'You do not have permission to change this workshop date.'
                }, status=status.HTTP_403_FORBIDDEN)

            workshop.date = new_date
            workshop.save()

            return Response({
                'message': 'Workshop date changed successfully.',
                'workshop': WorkshopDetailSerializer(workshop).data
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get', 'post'], permission_classes=[IsAuthenticated])
    def comments(self, request, pk=None):
        """
        Get or post comments for a workshop
        GET  /api/workshops/<id>/comments/
        POST /api/workshops/<id>/comments/
        """
        workshop = self.get_object()

        if request.method == 'GET':
            # Get comments - show only public comments
            comments = Comment.objects.filter(workshop=workshop, public=True)
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'POST':
            # Create comment
            serializer = CommentSerializer(
                data=request.data,
                context={'request': request, 'workshop': workshop}
            )
            if serializer.is_valid():
                serializer.save(workshop=workshop)
                return Response({
                    'message': 'Comment posted successfully.',
                    'comment': serializer.data
                }, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StatisticsPublicView(APIView):
    """
    Public statistics about workshops
    GET /api/statistics/public/
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Get accepted workshops
        workshops = Workshop.objects.filter(status=1)

        total = workshops.count()
        accepted = workshops.count()
        pending = Workshop.objects.filter(status=0).count()

        # Get state and type data
        states_data = Workshop.objects.filter(status=1).values_list(
            'coordinator__profile__state'
        ).distinct().count()

        types_data = workshops.values('workshop_type__name').distinct().count()

        return Response({
            'total_workshops': total,
            'accepted_workshops': accepted,
            'pending_workshops': pending,
            'states_count': states_data,
            'types_count': types_data,
        }, status=status.HTTP_200_OK)


class StatisticsTeamView(APIView):
    """
    Team statistics - workshop counts by member
    GET /api/statistics/team/
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Check if requester has permission to view team stats
        if request.user.profile.position != 'instructor':
            return Response({
                'error': 'Only instructors can view team statistics.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Get workshops conducted by this instructor
        workshops = Workshop.objects.filter(instructor=request.user)

        stats = {
            'total_workshops': workshops.count(),
            'accepted_workshops': workshops.filter(status=1).count(),
            'pending_workshops': workshops.filter(status=0).count(),
            'deleted_workshops': workshops.filter(status=2).count(),
        }

        return Response(stats, status=status.HTTP_200_OK)
