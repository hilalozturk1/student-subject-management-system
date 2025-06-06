from rest_framework import serializers
from .models import Course
from students.models import Student

class CourseSerializer(serializers.ModelSerializer):
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_enrolled_students(self, obj):
        return obj.enrollment_set.values('student__first_name', 'student__last_name', 'student_id')