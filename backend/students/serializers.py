from rest_framework import serializers
from .models import Student
from enrollments.serializers import EnrollmentSerializer

class StudentSerializer(serializers.ModelSerializer):
    enrolled_courses = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = '__all__'
        read_only_fields = ['user']

    def get_enrolled_courses(self, obj):
        return obj.enrollment_set.values('course__name', 'course_id')