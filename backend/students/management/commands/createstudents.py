from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create example students'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        students = [
            {"username": "student1", "email": "student1@gmail.com", "password": "student1", "is_staff": False},
            {"username": "student2", "email": "student2@gmail.com", "password": "student2", "is_staff": False},
            {"username": "student3", "email": "student3@gmail.com", "password": "student3", "is_staff": False},
        ]
        for s in students:
            if not User.objects.filter(username=s["username"]).exists():
                User.objects.create_user(**s)
        self.stdout.write(self.style.SUCCESS('Example students created.'))