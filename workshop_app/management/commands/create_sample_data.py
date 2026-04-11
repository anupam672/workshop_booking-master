from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from workshop_app.models import Profile, WorkshopType, Workshop, Comment
from django.utils import timezone
from datetime import timedelta
import uuid


class Command(BaseCommand):
    help = 'Create sample data for workshop booking application'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create groups
        instructor_group, _ = Group.objects.get_or_create(name='instructor')
        coordinator_group, _ = Group.objects.get_or_create(name='coordinator')

        # Create instructor users
        instructor_data = [
            {'username': 'instructor1', 'email': 'instructor1@fossee.in', 'first_name': 'Rajesh', 'last_name': 'Kumar'},
            {'username': 'instructor2', 'email': 'instructor2@fossee.in', 'first_name': 'Priya', 'last_name': 'Singh'},
            {'username': 'instructor3', 'email': 'instructor3@fossee.in', 'first_name': 'Amit', 'last_name': 'Patel'},
        ]

        instructors = []
        for data in instructor_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
                instructor_group.user_set.add(user)
                # Create profile
                Profile.objects.create(
                    user=user,
                    title='Dr.',
                    institute='IIT Bombay',
                    department='Computer Science',
                    phone_number='9876543210',
                    position='instructor',
                    state='Maharashtra',
                    is_email_verified=True
                )
                self.stdout.write(self.style.SUCCESS(f'Created instructor: {data["username"]}'))
            instructors.append(user)

        # Create coordinator users
        coordinator_data = [
            {'username': 'coordinator1', 'email': 'coordinator1@fossee.in', 'first_name': 'Ramesh', 'last_name': 'Gupta'},
            {'username': 'coordinator2', 'email': 'coordinator2@fossee.in', 'first_name': 'Neha', 'last_name': 'Sharma'},
            {'username': 'coordinator3', 'email': 'coordinator3@fossee.in', 'first_name': 'Vikram', 'last_name': 'Rao'},
        ]

        coordinators = []
        for data in coordinator_data:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={
                    'email': data['email'],
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                }
            )
            if created:
                user.set_password('testpass123')
                user.save()
                coordinator_group.user_set.add(user)
                # Create profile
                Profile.objects.create(
                    user=user,
                    title='Mr./Ms.',
                    institute='Local Institute',
                    department='Administration',
                    phone_number='8765432109',
                    position='coordinator',
                    state='Karnataka',
                    is_email_verified=True
                )
                self.stdout.write(self.style.SUCCESS(f'Created coordinator: {data["username"]}'))
            coordinators.append(user)

        # Create workshop types
        workshop_types_data = [
            {
                'name': 'Linux and Open Source',
                'description': 'Introduction to Linux operating system and open source software',
                'duration': 5,
                'terms_and_conditions': 'Participants must have basic computer knowledge'
            },
            {
                'name': 'Python Programming',
                'description': 'Learn Python programming from basics to advanced',
                'duration': 4,
                'terms_and_conditions': 'No prior programming experience required'
            },
            {
                'name': 'Web Development',
                'description': 'Full-stack web development with modern frameworks',
                'duration': 6,
                'terms_and_conditions': 'Basic knowledge of HTML and CSS required'
            },
            {
                'name': 'Data Science with Python',
                'description': 'Data analysis and machine learning with Python',
                'duration': 5,
                'terms_and_conditions': 'Basic Python knowledge required'
            },
        ]

        workshop_types = []
        for data in workshop_types_data:
            wtype, created = WorkshopType.objects.get_or_create(
                name=data['name'],
                defaults=data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created workshop type: {data["name"]}'))
            workshop_types.append(wtype)

        # Create workshops
        workshop_dates = [
            timezone.now() + timedelta(days=30),
            timezone.now() + timedelta(days=45),
            timezone.now() + timedelta(days=60),
            timezone.now() + timedelta(days=75),
            timezone.now() + timedelta(days=90),
            timezone.now() + timedelta(days=105),
        ]

        for i, date in enumerate(workshop_dates):
            workshop_uid = uuid.uuid4()
            workshop, created = Workshop.objects.get_or_create(
                uid=workshop_uid,
                defaults={
                    'coordinator': coordinators[i % len(coordinators)],
                    'instructor': instructors[i % len(instructors)] if i < 3 else None,
                    'workshop_type': workshop_types[i % len(workshop_types)],
                    'date': date,
                    'status': 1 if i < 3 else 0,  # First 3 are accepted, rest are pending
                    'tnc_accepted': True
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created workshop: {workshop.uid}'))

        # Create some comments
        workshops = Workshop.objects.filter(status=1)[:2]
        for workshop in workshops:
            Comment.objects.get_or_create(
                workshop=workshop,
                author=instructors[0],
                comment='Great workshop experience!',
                public=True
            )

        self.stdout.write(self.style.SUCCESS('Sample data created successfully!'))
