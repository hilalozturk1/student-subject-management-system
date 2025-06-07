from django.core.management.base import BaseCommand
from courses.models import Course

class Command(BaseCommand):
    help = 'Create example courses'

    def handle(self, *args, **kwargs):
        courses = [
            "Mathematics", "Physics", "Chemistry",
            "Biology", "History", "Literature"
        ]
        for name in courses:
            Course.objects.get_or_create(name=name)
        self.stdout.write(self.style.SUCCESS('Example courses created.'))