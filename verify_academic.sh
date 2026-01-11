#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== VERIFICATION: ACADEMIC SECTION ==="

# 1. Login as Teacher
echo -e "\n1. Logging in as Teacher..."
TEACHER_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"teacher_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TEACHER_TOKEN" ]; then
  echo "Teacher Login failed."
  exit 1
fi
echo "Teacher Token Acquired."

# 2. Upload PDF (Teacher)
echo -e "\n2. Uploading PDF..."
# Create dummy PDF
echo "Dummy PDF Content" > test.pdf

# We use curl with -F to send multipart/form-data
UPLOAD_RES=$(curl -s -X POST $BASE_URL/chapters/upload \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -F "title=Test Chapter" \
  -F "classId=ClassA" \
  -F "pdf=@test.pdf")

echo "Upload Response (truncated): ${UPLOAD_RES:0:100}..."
rm test.pdf

# 3. Login as Student
echo -e "\n3. Logging in as Student..."
STUDENT_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 4. Fetch Chapters (Student in ClassA)
# Note: In a real scenario, we'd need to ensure the student is linked to ClassA. 
# For now, we manually fetch by classId to verify the route works.
echo -e "\n4. Fetching Chapters..."
CHAPTERS=$(curl -s -X GET $BASE_URL/chapters/ClassA -H "Authorization: Bearer $STUDENT_TOKEN")
echo "Chapters: $CHAPTERS" | grep "Test Chapter" && echo "Verified: Content visible to student."

echo -e "\n=== DONE ==="
