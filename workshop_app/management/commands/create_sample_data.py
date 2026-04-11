from django.core.management.base import BaseCommand
from workshop_app.models import WorkshopType, AttachmentFile


class Command(BaseCommand):
    help = 'Create sample workshop types for testing'

    def handle(self, *args, **options):
        workshop_types = [
            {
                'name': 'Python Programming',
                'description': 'Learn Python programming from basics to advanced concepts',
                'duration': 3,
                'terms_and_conditions': 'Participants must have basic computer knowledge. Laptops are mandatory.'
            },
            {
                'name': 'Web Development with Django',
                'description': 'Build web applications using Django framework',
                'duration': 5,
                'terms_and_conditions': 'Requires knowledge of Python and HTML/CSS. Install Django before workshop.'
            },
            {
                'name': 'Data Science with Python',
                'description': 'Learn data analysis and visualization using Python libraries',
                'duration': 4,
                'terms_and_conditions': 'Knowledge of Python required. Bring a laptop with internet connectivity.'
            },
            {
                'name': 'Machine Learning Basics',
                'description': 'Introduction to machine learning concepts and algorithms',
                'duration': 5,
                'terms_and_conditions': 'Python and basic statistics knowledge required.'
            },
            {
                'name': 'Arduino and IoT',
                'description': 'Build IoT projects using Arduino microcontroller',
                'duration': 3,
                'terms_and_conditions': 'Basic electronics knowledge helpful. Arduino kits will be provided.'
            },
            {
                'name': 'Linux and Shell Scripting',
                'description': 'Master Linux operating system and shell scripting',
                'duration': 3,
                'terms_and_conditions': 'Access to Linux desktop/laptop required.'
            },
            {
                'name': 'Git and Version Control',
                'description': 'Learn Git for version control and collaboration',
                'duration': 2,
                'terms_and_conditions': 'Git should be installed on your machine.'
            },
            {
                'name': 'OpenFOAM CFD',
                'description': 'Computational Fluid Dynamics using OpenFOAM',
                'duration': 5,
                'terms_and_conditions': 'Linux knowledge required. OpenFOAM to be pre-installed.'
            },
        ]

        created_count = 0
        for wt_data in workshop_types:
            workshop_type, created = WorkshopType.objects.get_or_create(
                name=wt_data['name'],
                defaults={
                    'description': wt_data['description'],
                    'duration': wt_data['duration'],
                    'terms_and_conditions': wt_data['terms_and_conditions']
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created "{workshop_type.name}"')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'○ Already exists: "{workshop_type.name}"')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} workshop types!')
        )
