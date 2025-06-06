from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment
from .serializers import EnrollmentSerializer
from users.permissions import IsAdminUser, IsStudentUser
from students.models import Student

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

    def get_permissions(self):
        if self.action in ['create', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        elif self.action in ['update', 'partial_update']:
            self.permission_classes = [IsAdminUser]
        else: # list, retrieve
            self.permission_classes = [IsAuthenticated]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        student_id = serializer.validated_data.get('student').id
        course_id = serializer.validated_data.get('course').id
        
        if not self.request.user.is_staff:
            try:
                student = Student.objects.get(user=self.request.user)
                if student.id != student_id:
                    raise serializers.ValidationError("A student can only register in his/her own name.")
            except Student.DoesNotExist:
                raise serializers.ValidationError("No student profiles were found matching your user.")
        
        if Enrollment.objects.filter(student_id=student_id, course_id=course_id).exists():
            raise serializers.ValidationError("This student is already enrolled in this course.")
        
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            try:
                student = Student.objects.get(user=self.request.user)
                if instance.student != student:
                    raise serializers.ValidationError("This enrollment cannot be deleted by you.")
            except Student.DoesNotExist:
                raise serializers.ValidationError("No student profiles were found matching your user.")
        instance.delete()

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            queryset = self.filter_queryset(self.get_queryset())
        else:
            try:
                student = Student.objects.get(user=request.user)
                queryset = self.filter_queryset(self.get_queryset().filter(student=student))
            except Student.DoesNotExist:
                return Response({"detail": "Your student profile was not found."}, status=status.HTTP_404_NOT_FOUND)
            if not queryset.exists():
                return Response({"detail": "You are not registered for any courses."}, status=status.HTTP_404_NOT_FOUND)


        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_staff:
            try:
                student = Student.objects.get(user=request.user)
                if instance.student != student:
                    return Response({"detail": "You do not have permission to access this registration information."}, status=status.HTTP_403_FORBIDDEN)
            except Student.DoesNotExist:
                 return Response({"detail": "Your student profile was not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)