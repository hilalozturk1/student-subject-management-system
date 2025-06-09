from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from students.models import Student
from datetime import date

class Command(BaseCommand):
    help = 'Create example students'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        students = [
            {
                "username": "student1",
                "email": "student1@gmail.com",
                "password": "student1",
                "first_name": "Ali",
                "last_name": "Veli",
                "date_of_birth": date(2000,1,1)
            },
            {
                "username": "student2",
                "email": "student2@gmail.com",
                "password": "student2",
                "first_name": "Ayşe",
                "last_name": "Demir",
                "date_of_birth": date(2001,2,2)
            },
            {
                "username": "student3",
                "email": "student3@gmail.com",
                "password": "student3",
                "first_name": "Mehmet",
                "last_name": "Kaya",
                "date_of_birth": date(2002,3,3)
            },
        ]
        for s in students:
            user, created = User.objects.get_or_create(
                username=s["username"],
                defaults={
                    "email": s["email"],
                    "is_staff": False
                }
            )
            
            if created:
                user.set_password(s["password"])
                user.save()
            if created or not Student.objects.filter(user=user).exists():
                Student.objects.get_or_create(
                    user=user,
                    defaults={
                        "first_name": s["first_name"],
                        "last_name": s["last_name"],
                        "date_of_birth": s["date_of_birth"],
                        "email": s["email"],
                    }
                )
        self.stdout.write(self.style.SUCCESS('Example students created.'))