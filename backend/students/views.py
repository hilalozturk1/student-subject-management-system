from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Student
from .serializers import StudentSerializer
from users.permissions import IsAdminUser, IsOwnerOrAdmin
from django.shortcuts import get_object_or_404

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser]
        elif self.action == 'list':
            self.permission_classes = [IsAuthenticated]
        elif self.action == 'retrieve':
            self.permission_classes = [IsAuthenticated, IsOwnerOrAdmin]
        return [permission() for permission in self.permission_classes]

    def perform_create(self, serializer):
        serializer.save()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_staff and instance.user != request.user:
            return Response({"detail": "You dont have permission to access to this user."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        if request.user.is_staff:
            queryset = self.filter_queryset(self.get_queryset())
        else:
            try:
                queryset = self.filter_queryset(self.get_queryset().filter(user=request.user))
            except Student.DoesNotExist:
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
            if not queryset.exists():
                return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)


        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)