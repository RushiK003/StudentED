#!/bin/bash

BASE_URL="http://localhost:5000/api"

echo "=== VERIFICATION SCRIPT ==="

# 1. Register Users
echo -e "\n1. Registering Users..."
curl -s -X POST $BASE_URL/auth/register -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123","role":"student","classId":"ClassA"}'
curl -s -X POST $BASE_URL/auth/register -H "Content-Type: application/json" -d '{"username":"teacher_test","password":"password123","role":"teacher"}'
curl -s -X POST $BASE_URL/auth/register -H "Content-Type: application/json" -d '{"username":"other_student","password":"password123","role":"student"}'

# 2. Login & Get Tokens
echo -e "\n\n2. Logging in..."
STUDENT_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"student_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
TEACHER_TOKEN=$(curl -s -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"username":"teacher_test","password":"password123"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Student Token: ${STUDENT_TOKEN:0:10}..."
echo "Teacher Token: ${TEACHER_TOKEN:0:10}..."

# 3. Test Habit CRUD (Student)
echo -e "\n\n3. Testing Habit CRUD (Student)..."
# Create
HABIT_ID=$(curl -s -X POST $BASE_URL/habits -H "Content-Type: application/json" -H "Authorization: Bearer $STUDENT_TOKEN" -d '{"title":"Study React"}' | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Created Habit ID: $HABIT_ID"

# Read
curl -s -X GET $BASE_URL/habits -H "Authorization: Bearer $STUDENT_TOKEN" | grep "Study React" && echo "Verified: Habit found in list"

# 4. Test Class CRUD (Teacher)
echo -e "\n\n4. Testing Class CRUD (Teacher)..."
# Create
CLASS_ID=$(curl -s -X POST $BASE_URL/classes -H "Content-Type: application/json" -H "Authorization: Bearer $TEACHER_TOKEN" -d '{"name":"Math 101"}' | grep -o '"_id":"[^"]*' | cut -d'"' -f4)
echo "Created Class ID: $CLASS_ID"

# Read
curl -s -X GET $BASE_URL/classes -H "Authorization: Bearer $TEACHER_TOKEN" | grep "Math 101" && echo "Verified: Class found in list"

# 5. Security Check (Negative Test)
echo -e "\n\n5. Security Check..."
# Student tries to create Class (Should Fail)
RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $BASE_URL/classes -H "Content-Type: application/json" -H "Authorization: Bearer $STUDENT_TOKEN" -d '{"name":"Hacked Class"}')
if [ "$RESPONSE_CODE" == "403" ]; then
    echo "Verified: Student cannot create class (403 Forbidden)"
else
    echo "FAILED: Student created class or wrong error code: $RESPONSE_CODE"
fi

echo -e "\n=== DONE ==="
