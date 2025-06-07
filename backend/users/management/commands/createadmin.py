from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create an initial admin user if not exists'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@gmail.com',
                password='admin',
                is_staff=True
            )
            self.stdout.write(self.style.SUCCESS('Admin user created.'))
        else:
            self.stdout.write(self.style.WARNING('Admin user already exists.'))