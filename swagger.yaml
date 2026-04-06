openapi: 3.0.3
info:
  title: 오즈 코딩 스쿨 Backend API
  version: 1.0.0
  description: 오즈 코딩 스쿨의 웹 사이트 개발을 위한 API입니다.
paths:
  /api/v1/{course_id}/cohorts:
    get:
      operationId: v1_cohorts_retrieve
      summary: 기수 리스트 조회 API
      parameters:
      - in: path
        name: course_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_students
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CohortListItem'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
  /api/v1/{course_id}/subjects:
    get:
      operationId: v1_subjects_retrieve
      summary: 어드민 과목 목록 API
      parameters:
      - in: path
        name: course_id
        schema:
          type: integer
        description: 과정 ID
        required: true
      tags:
      - Course
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SubjectListItem'
              examples:
                ResponseExample:
                  value:
                  - - id: 1
                      course_id: 1
                      title: test
                      status: activated
                      thumbnail_img_url: https://www.test.com
                  summary: Response Example
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Forbidden
    post:
      operationId: v1_subjects_create
      summary: 어드민 과목 생성 API
      parameters:
      - in: path
        name: course_id
        schema:
          type: integer
        description: 과정 ID
        required: true
      tags:
      - Course
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SubjectCreateRequestRequest'
            examples:
              RequestExample:
                value:
                  course_id: 1
                  title: HTML
                  number_of_days: 5
                  number_of_hours: 40
                  thumbnail_img_url: https://example.com/html.png
                summary: Request Example
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/SubjectCreateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/SubjectCreateRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SubjectCreateResponse'
              examples:
                ResponseExample:
                  value:
                    id: 1
                    course_id: 1
                    title: HTML
                    number_of_days: 5
                    number_of_hours: 40
                    thumbnail_img_url: https://example.com/html.png
                    status: activated
                  summary: Response Example
          description: Created
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Not Found
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Conflict
  /api/v1/{exam_id}/questions:
    post:
      operationId: v1_questions_create
      summary: 쪽지시험 문제 등록
      parameters:
      - in: path
        name: exam_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionCreateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 등록 데이터입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 등록 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 해당 쪽지시험 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 해당 쪽지시험에 등록 가능한 문제 수 또는 총 배점을 초과했습니다.
          description: ''
  /api/v1/accounts/available-courses:
    get:
      operationId: v1_accounts_available_courses_list
      summary: 수강 신청 가능한 기수 조회
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AvailableCourse'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
  /api/v1/accounts/change-password:
    post:
      operationId: v1_accounts_change_password_create
      summary: 비밀번호 변경 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PasswordChangeRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PasswordChangeRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PasswordChangeRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/change-phone:
    patch:
      operationId: v1_accounts_change_phone_partial_update
      description: 인증 토큰을 확인하여 사용자의 휴대폰 번호를 변경합니다.
      summary: 휴대폰 번호 변경
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedPhoneNumberChangeRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedPhoneNumberChangeRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedPhoneNumberChangeRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/check-nickname:
    post:
      operationId: v1_accounts_check_nickname_create
      description: 닉네임이 중복되는지 확인합니다..
      summary: 닉네임 중복 확인
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/NicknameCheckRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/NicknameCheckRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/NicknameCheckRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/enroll-student:
    post:
      operationId: v1_accounts_enroll_student_create
      summary: 수강생 등록 신청 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EnrollStudentRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EnrollStudentRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/EnrollStudentRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          description: 수강생 등록 신청완료.
        '400':
          description: 이 필드는 필수 항목입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
  /api/v1/accounts/find-email:
    post:
      operationId: v1_accounts_find_email_create
      description: 이름과 휴대폰인증 후 받은 sms_token을 입력하여 일부 가려진 상태의 이메일을 확인합니다.
      summary: 이메일 찾기
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/FindEmailRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/FindEmailRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/FindEmailRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  email:
                    type: string
                    example: u**r@e****le.com
          description: 이메일을 찾았습니다.
        '400':
          description: 잘못된 요청 또는 인증 실패
  /api/v1/accounts/find-password:
    post:
      operationId: v1_accounts_find_password_create
      summary: 비밀번호 분실 시 재설정
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PasswordFindRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PasswordFindRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PasswordFindRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/login:
    post:
      operationId: v1_accounts_login_create
      description: 이메일과 비밀번호로 로그인하고, access_token은 바디로, refresh_token은 쿠키로 받습니다.
      summary: 로그인 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/LoginRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/LoginRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    description: 서비스 이용을 위한 액세스 토큰
          description: 로그인 성공
        '400':
          description: 잘못된 요청 (이메일/비밀번호 불일치)
        '403':
          description: 탈퇴 신청 계정 (접근 권한 없음)
  /api/v1/accounts/logout:
    post:
      operationId: v1_accounts_logout_create
      description: 브라우저 쿠키에 저장된 refresh_token을 삭제해 로그아웃 처리합니다.
      summary: 로그아웃 API
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  detail:
                    type: string
                    description: 로그아웃 되었습니다.
          description: 로그아웃 성공
        '401':
          description: 인증 실패 (로그인 필요)
  /api/v1/accounts/me:
    get:
      operationId: v1_accounts_me_retrieve
      description: 로그인한 사용자의 프로필 정보를 가져옵니다.
      summary: 내 정보 조회
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfile'
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
    patch:
      operationId: v1_accounts_me_partial_update
      description: 내 정보를 수정합니다.
      summary: 내 정보 수정
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedUserProfileUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedUserProfileUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedUserProfileUpdateRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserProfileUpdate'
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
    delete:
      operationId: v1_accounts_me_destroy
      description: 회원 탈퇴 사유를 기록하고 유저 상태를 비활성화합니다.
      summary: 회원 탈퇴
      parameters:
      - in: query
        name: reason
        schema:
          type: string
          enum:
          - FOUND_BETTER_SERVICE
          - GRADUATION
          - LACK_OF_CONTENT
          - LACK_OF_INTEREST
          - NO_LONGER_NEEDED
          - OTHER
          - POOR_SERVICE_QUALITY
          - PRIVACY_CONCERNS
          - TECHNICAL_ISSUES
          - TOO_DIFFICULT
          - TRANSFER
        description: 탈퇴 사유 (필수)
        required: true
      - in: query
        name: reason_detail
        schema:
          type: string
        description: 상세 사유
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '204':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/me/enrolled-courses:
    get:
      operationId: v1_accounts_me_enrolled_courses_list
      summary: 내 수강 목록 조회
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MyEnrolledCourse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/me/profile-image:
    patch:
      operationId: v1_accounts_me_profile_image_partial_update
      description: 이미지 URL을 받아 사용자의 프로필 사진으로 등록합니다.
      summary: 프로필 이미지 수정
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedProfileImageRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedProfileImageRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedProfileImageRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProfileImage'
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/me/profile-image/presigned-url:
    put:
      operationId: v1_accounts_me_profile_image_presigned_url_update
      summary: 프로필 이미지 업로드용 Presigned URL 발급
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: Presigned URL 발급 성공
        '400':
          description: 지원하지 않는 파일 형식입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
  /api/v1/accounts/me/refresh:
    post:
      operationId: v1_accounts_me_refresh_create
      description: 쿠키의 refresh_token으로 access_token을 재발급합니다.
      summary: JWT 토큰 재발급 API
      tags:
      - Accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                    description: 서비스 이용을 위한 액세스 토큰
          description: 재발급 성공
        '400':
          description: 'error_detail: { refresh_token: [필수 항목 누락] }'
        '403':
          description: 'error_detail: { detail: 로그인 세션 만료 }'
  /api/v1/accounts/restore:
    post:
      operationId: v1_accounts_restore_create
      summary: 계정 복구 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AccountRecoveryRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AccountRecoveryRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AccountRecoveryRequest'
        required: true
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '404':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/accounts/signup:
    post:
      operationId: v1_accounts_signup_create
      description: 사용자 정보를 입력받아 계정을 생성하고 가입 정보를 반환하는 API
      summary: 회원가입
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SignUpRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/SignUpRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/SignUpRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/SignUp'
              examples:
                회원가입성공예시:
                  value:
                    detail: 회원가입이 완료되었습니다.
                    user_info:
                      email: test@example.com
                      nickname: 테스트유저
                      name: 홍길동
                      birthday: '1995-01-01'
                      gender: M
                      phone_number: 01012345678
                  summary: 회원가입 성공 예시
          description: ''
        '400':
          description: 요청 데이터 오류 (필수필드 누락)
        '409':
          description: 이미 중복된 회원가입 내역이 존재합니다.
  /api/v1/accounts/social-login/kakao:
    get:
      operationId: v1_accounts_social_login_kakao_retrieve
      description: |-
        ## 프론트엔드 사용법

        1. 카카오 로그인 버튼 클릭 시 이 URL로 **GET 요청**
        2. 카카오 인증 페이지로 자동 리다이렉트됨
        3. 유저가 카카오 로그인 완료 → 콜백 URL로 자동 이동
        4. 콜백 처리 후 프론트 `{FRONTEND_SOCIAL_REDIRECT_URL}?provider=kakao&is_success=true`로 리다이렉트
        5. **refresh_token**이 쿠키(httponly)에 세팅됨
        6. 프론트에서 `POST /api/v1/accounts/me/refresh`를 호출하여 **access_token**을 발급받아 사용

        **[카카오 로그인 테스트 (클릭)](/api/v1/accounts/social-login/kakao)**
      summary: 카카오 로그인 시작 (GET → 카카오 인증 페이지로 리다이렉트)
      tags:
      - Accounts
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '302':
          description: 카카오 인증 페이지로 리다이렉트
  /api/v1/accounts/social-login/kakao/callback:
    get:
      operationId: v1_accounts_social_login_kakao_callback_retrieve
      description: |-
        카카오 인증 완료 후 카카오가 자동으로 호출하는 콜백 엔드포인트입니다.

        **프론트에서 직접 호출할 필요 없음.**

        처리 완료 후 프론트로 리다이렉트되며, **refresh_token**이 쿠키에 세팅됩니다.
        프론트에서 `POST /api/v1/accounts/me/refresh` 호출 → access_token 발급받아 사용.
      summary: 카카오 로그인 콜백 (프론트에서 직접 호출 X — 카카오가 자동 호출)
      parameters:
      - in: query
        name: code
        schema:
          type: string
        description: 카카오 인가 코드 (카카오가 전달)
      - in: query
        name: state
        schema:
          type: string
        description: CSRF 방지용 상태 값 (카카오가 전달)
      tags:
      - Accounts
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '302':
          description: 프론트엔드로 리다이렉트 + refresh_token 쿠키 세팅
  /api/v1/accounts/social-login/naver:
    get:
      operationId: v1_accounts_social_login_naver_retrieve
      description: |-
        ## 프론트엔드 사용법

        1. 네이버 로그인 버튼 클릭 시 이 URL로 **GET 요청**
        2. 네이버 인증 페이지로 자동 리다이렉트됨
        3. 유저가 네이버 로그인 완료 → 콜백 URL로 자동 이동
        4. 콜백 처리 후 프론트 `{FRONTEND_SOCIAL_REDIRECT_URL}?provider=naver&is_success=true`로 리다이렉트
        5. **refresh_token**이 쿠키(httponly)에 세팅됨
        6. 프론트에서 `POST /api/v1/accounts/me/refresh`를 호출하여 **access_token**을 발급받아 사용

        **[네이버 로그인 테스트 (클릭)](/api/v1/accounts/social-login/naver)**
      summary: 네이버 로그인 시작 (GET → 네이버 인증 페이지로 리다이렉트)
      tags:
      - Accounts
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '302':
          description: 네이버 인증 페이지로 리다이렉트
  /api/v1/accounts/social-login/naver/callback:
    get:
      operationId: v1_accounts_social_login_naver_callback_retrieve
      description: |-
        네이버 인증 완료 후 네이버가 자동으로 호출하는 콜백 엔드포인트입니다.

        **프론트에서 직접 호출할 필요 없음.**

        처리 완료 후 프론트로 리다이렉트되며, **refresh_token**이 쿠키에 세팅됩니다.
        프론트에서 `POST /api/v1/accounts/me/refresh` 호출 → access_token 발급받아 사용.
      summary: 네이버 로그인 콜백 (프론트에서 직접 호출 X — 네이버가 자동 호출)
      parameters:
      - in: query
        name: code
        schema:
          type: string
        description: 네이버 인가 코드 (네이버가 전달)
      - in: query
        name: state
        schema:
          type: string
        description: CSRF 방지용 상태 값 (네이버가 전달)
      tags:
      - Accounts
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '302':
          description: 프론트엔드로 리다이렉트 + refresh_token 쿠키 세팅
  /api/v1/accounts/verification/send-sms:
    post:
      operationId: v1_accounts_verification_send_sms_create
      description: 사용자로부터 휴대폰번호를 받아 Twilio를 통해 인증 코드를 발송합니다.
      summary: SMS 인증번호 발송 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SmsSendRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/SmsSendRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/SmsSendRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          description: 인증 코드가 전송 되었습니다.
        '400':
          description: 필수필드 누락/휴대폰 형식이 아닙니다.
  /api/v1/accounts/verification/verify-email:
    post:
      operationId: v1_accounts_verification_verify_email_create
      description: 사용자로부터 이메일과 인증 코드를 받아 확인을 완료합니다.
      summary: 이메일 인증 확인 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmailVerifyRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EmailVerifyRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/EmailVerifyRequest'
        required: true
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          description: 이메일 인증이 완료되었습니다.
        '400':
          description: 잘못된 인증 코드이거나 만료된 요청입니다.
  /api/v1/accounts/verification/verify-sms:
    post:
      operationId: v1_accounts_verification_verify_sms_create
      description: 사용자로부터 휴대폰번호와 인증 코드를 받아 확인을 완료합니다.
      summary: SMS 인증 확인 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/SmsVerifyRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/SmsVerifyRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/SmsVerifyRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          description: SMS 인증이 완료되었습니다.
        '400':
          description: 잘못된 인증 코드이거나 만료된 요청입니다.
  /api/v1/accounts/verify/email/recovery/:
    post:
      operationId: v1_accounts_verify_email_recovery_create
      description: 가입된 계쩡이 있는지 확인 후 인증 코드를 발송합니다.
      summary: 계정복구,비밀번호 재설정 이메일 인증 발송 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
        required: true
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          description: 인증코드가 발송되었습니다.
        '400':
          description: 필수필드 누락/이메일 형식이 아닙니다.
  /api/v1/accounts/verify/email/signup/:
    post:
      operationId: v1_accounts_verify_email_signup_create
      description: 사용자로부터 가입되지 않은 이메일을 받아 인증 코드를 발송합니다.
      summary: 회원가입 이메일 인증 발송 API
      tags:
      - Accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/EmailSendRequest'
        required: true
      security:
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          description: 인증코드가 발송되었습니다.
        '400':
          description: 필수필드 누락/이메일 형식이 아닙니다.
  /api/v1/admin/accounts:
    get:
      operationId: v1_admin_accounts_list
      description: 회원 목록을 조회하고 이름/이메일 검색 및 상태/역할 필터링을 제공합니다.
      summary: 어드민 - 회원 목록 조회
      parameters:
      - name: page
        required: false
        in: query
        description: A page number within the paginated result set.
        schema:
          type: integer
      - in: query
        name: role
        schema:
          type: string
          enum:
          - ADMIN
          - LC
          - OM
          - STUDENT
          - TA
          - USER
        description: 회원 권한 필터
      - in: query
        name: search
        schema:
          type: string
        description: 이름 또는 이메일 검색
      - in: query
        name: status
        schema:
          type: string
          enum:
          - ACTIVATED
          - DEACTIVATED
          - WITHDREW
        description: 회원 상태 필터
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAdminUserSearchListList'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/accounts/{account_id}:
    get:
      operationId: v1_admin_accounts_retrieve
      description: 특정 회원의 상세 정보와 수강 기록을 조회합니다.
      summary: 어드민 - 회원 상세 조회
      parameters:
      - in: path
        name: account_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminUserSearchDetail'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 사용자 정보를 찾을 수 없습니다.
  /api/v1/admin/accounts/{account_id}/:
    delete:
      operationId: v1_admin_accounts_destroy
      description: 관리자 페이지에서 사용자를 삭제하는 API입니다.
      summary: 어드민 페이지 사용자 삭제 API
      parameters:
      - in: path
        name: account_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 유저 데이터가 삭제되었습니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 사용자 정보를 찾을 수 없습니다.
  /api/v1/admin/accounts/{account_id}/role/:
    patch:
      operationId: v1_admin_accounts_role_partial_update
      description: 관리자 페이지에서 사용자의 권한을 변경합니다.
      summary: 어드민 페이지 권한 변경 API
      parameters:
      - in: path
        name: account_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedAdminUserRoleUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedAdminUserRoleUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedAdminUserRoleUpdateRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 권한이 변경되었습니다.
        '400':
          description: 조교 권한으로 변경 시 필수 필드입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 사용자 정보를 찾을 수 없습니다.
  /api/v1/admin/analytics/signup/trends/:
    get:
      operationId: v1_admin_analytics_signup_trends_retrieve
      summary: 어드민 회원가입 추세 분석
      parameters:
      - in: query
        name: from_date
        schema:
          type: string
        description: 시작일 (YYYY-MM-DD)
      - in: query
        name: interval
        schema:
          type: string
        description: 분석 간격 (monthly/yearly)
        required: true
      - in: query
        name: to_date
        schema:
          type: string
        description: 종료일 (YYYY-MM-DD)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminAnalyticsTrend'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/analytics/withdrawal-reasons/counts/:
    get:
      operationId: v1_admin_analytics_withdrawal_reasons_counts_retrieve
      summary: 탈퇴 사유별 갯수 분석
      parameters:
      - in: query
        name: from_date
        schema:
          type: string
          format: date
        description: 시작일 (YYYY-MM-DD)
      - in: query
        name: to_date
        schema:
          type: string
          format: date
        description: 종료일 (YYYY-MM-DD)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WithdrawalReasonCount'
          description: ''
  /api/v1/admin/analytics/withdrawal-reasons/stats/monthly/:
    get:
      operationId: v1_admin_analytics_withdrawal_reasons_stats_monthly_retrieve
      summary: 특정 사유의 월별 탈퇴 추세
      parameters:
      - in: query
        name: from_date
        schema:
          type: string
          format: date
        description: 시작일 (YYYY-MM-DD)
      - in: query
        name: reason
        schema:
          type: string
        description: 탈퇴 사유 코드
        required: true
      - in: query
        name: to_date
        schema:
          type: string
          format: date
        description: 종료일 (YYYY-MM-DD)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/WithdrawalMonthlyReasonStats'
          description: ''
  /api/v1/admin/analytics/withdrawals/trends/:
    get:
      operationId: v1_admin_analytics_withdrawals_trends_retrieve
      summary: 어드민 회원탈퇴 추세 분석
      parameters:
      - in: query
        name: from_date
        schema:
          type: string
        description: 시작일 (YYYY-MM-DD)
      - in: query
        name: interval
        schema:
          type: string
        description: 분석 간격 (monthly/yearly)
        required: true
      - in: query
        name: to_date
        schema:
          type: string
        description: 종료일 (YYYY-MM-DD)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminAnalyticsTrend'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/cohorts:
    post:
      operationId: v1_admin_cohorts_create
      summary: 어드민 페이지 기수 등록 API
      tags:
      - Admin_students
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CohortCreateRequestRequest'
            examples:
              RequestExample:
                value:
                  course_id: 1
                  number: 15
                  max_student: 30
                  start_date: '2025-11-01'
                  end_date: '2026-04-30'
                  status: PREPARING
                summary: request example
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/CohortCreateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/CohortCreateRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CohortCreateResponse'
              examples:
                SuccessExample:
                  value:
                    detail: 기수가 등록되었습니다.
                    id: 1
                  summary: success example
          description: Created
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailField'
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
  /api/v1/admin/cohorts/{cohort_id}:
    patch:
      operationId: v1_admin_cohorts_partial_update
      summary: 어드민 페이지 기수 정보 수정 API
      parameters:
      - in: path
        name: cohort_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_students
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedCohortUpdateRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedCohortUpdateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedCohortUpdateRequestRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CohortUpdateResponse'
          description: OK
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailField'
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
  /api/v1/admin/cohorts/{cohort_id}/students:
    get:
      operationId: v1_admin_cohorts_students_retrieve
      summary: 어드민 기수별 수강생 목록 조회 API
      parameters:
      - in: path
        name: cohort_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_students
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CohortStudentItem'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
  /api/v1/admin/courses:
    post:
      operationId: v1_admin_courses_create
      description: 새로운 과정을 등록합니다.
      summary: 어드민 과정 등록
      tags:
      - Admin_students
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CourseCreateRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/CourseCreateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/CourseCreateRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseCreateResponse'
          description: ''
        '400':
          description: 유효하지 않은 요청입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/courses/{course_id}:
    patch:
      operationId: v1_admin_courses_partial_update
      description: 과정 정보를 수정합니다.
      summary: 어드민 과정 정보 수정
      parameters:
      - in: path
        name: course_id
        schema:
          type: string
        required: true
      tags:
      - Admin_students
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedCourseUpdateRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedCourseUpdateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedCourseUpdateRequestRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseUpdateResponse'
          description: ''
        '400':
          description: 'feild_name : [이 필드는 필수 항목입니다.]'
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 과정을 찾을 수 없습니다.
    delete:
      operationId: v1_admin_courses_destroy
      description: 과정을 삭제합니다.
      summary: 어드민 과정 삭제
      parameters:
      - in: path
        name: course_id
        schema:
          type: string
        required: true
      tags:
      - Admin_students
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CourseDeleteResponse'
          description: ''
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 과정을 찾을 수 없습니다.
  /api/v1/admin/courses/{course_id}/cohorts/avg-scores:
    get:
      operationId: v1_admin_courses_cohorts_avg_scores_retrieve
      summary: 어드민 기수별 평균 점수 조회 API
      parameters:
      - in: path
        name: course_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_students
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CohortAvgScoreItem'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
  /api/v1/admin/exams:
    get:
      operationId: v1_admin_exams_list
      description: 검색 키워드, 과목 ID, 정렬 조건을 받아 페이지네이션된 시험 목록을 반환합니다.
      summary: 쪽지시험 목록 조회
      parameters:
      - in: query
        name: order
        schema:
          type: string
        description: 정렬 순서 (asc, desc)
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: search_keyword
        schema:
          type: string
        description: 시험 제목 검색어
      - in: query
        name: size
        schema:
          type: integer
        description: 페이지당 아이템 개수
      - in: query
        name: sort
        schema:
          type: string
        description: 정렬 필드 (id, title, created_at 등)
      - in: query
        name: subject_id
        schema:
          type: integer
        description: 과목 ID 필터
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ExamList'
          description: ''
        '400':
          description: 유효하지 않은 조회 요청입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 쪽지시험 목록 조회 권한이 없습니다.
    post:
      operationId: v1_admin_exams_create
      description: 새로운 쪽지시험을 생성합니다.
      summary: 쪽지시험 생성
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamCreateUpdate'
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '403':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '404':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/admin/exams/{exam_id}:
    get:
      operationId: v1_admin_exams_retrieve
      description: 시험의 상세 정보와 포함된 질문 리스트를 조회합니다.
      summary: 쪽지시험 상세 조회
      parameters:
      - in: path
        name: exam_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDetail'
          description: ''
    put:
      operationId: v1_admin_exams_update
      description: 기존 쪽지시험 정보를 수정합니다.
      summary: 쪽지시험 수정
      parameters:
      - in: path
        name: exam_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamCreateUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamCreateUpdate'
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '403':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '404':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
    delete:
      operationId: v1_admin_exams_destroy
      description: 특정 쪽지시험을 삭제합니다.
      summary: 쪽지시험 삭제
      parameters:
      - in: path
        name: exam_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '403':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '404':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
        '409':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
                description: Unspecified response body
          description: ''
  /api/v1/admin/exams/{exam_id}/questions:
    post:
      operationId: v1_admin_exams_questions_create
      summary: 쪽지시험 문제 등록
      parameters:
      - in: path
        name: exam_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionCreateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 등록 데이터입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 등록 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 해당 쪽지시험 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 해당 쪽지시험에 등록 가능한 문제 수 또는 총 배점을 초과했습니다.
          description: ''
  /api/v1/admin/exams/deployments:
    get:
      operationId: v1_admin_exams_deployments_retrieve
      summary: 쪽지시험 배포 목록 조회 API
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentListResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
    post:
      operationId: v1_admin_exams_deployments_create
      summary: 쪽지시험 배포 생성 API
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamDeploymentCreateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamDeploymentCreateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamDeploymentCreateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentCreateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
  /api/v1/admin/exams/deployments/{deployment_id}:
    get:
      operationId: v1_admin_exams_deployments_retrieve_2
      summary: 쪽지시험 배포 상세 조회 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentDetail'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
    patch:
      operationId: v1_admin_exams_deployments_partial_update
      summary: 쪽지시험 배포 정보 수정 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentUpdateRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentUpdateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
    delete:
      operationId: v1_admin_exams_deployments_destroy
      summary: 쪽지시험 배포 삭제 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentDeleteResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
  /api/v1/admin/exams/deployments/{deployment_id}/status:
    patch:
      operationId: v1_admin_exams_deployments_status_partial_update
      summary: 쪽지시험 배포 on/off API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentStatusUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentStatusUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PatchedExamDeploymentStatusUpdateRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamDeploymentStatusUpdateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: ''
  /api/v1/admin/exams/questions/{question_id}:
    put:
      operationId: v1_admin_exams_questions_update
      summary: 쪽지시험 문제 수정
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionUpdateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 수정 데이터입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 수정 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 수정하려는 문제 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 시험 문제 수 제한 또는 총 배점을 초과하여 문제를 수정할 수 없습니다.
          description: ''
    delete:
      operationId: v1_admin_exams_questions_destroy
      summary: 쪽지시험 문제 삭제
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionDeleteResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 삭제 요청입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 삭제 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 삭제할 문제 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 쪽지시험 문제 삭제 처리 중 충돌이 발생했습니다.
          description: ''
  /api/v1/admin/exams/submissions:
    get:
      operationId: v1_admin_exams_submissions_list
      description: 관리자용 쪽지시험 응시 내역 목록을 페이지네이션하여 반환합니다.
      summary: 쪽지시험 응시 내역 목록 조회
      parameters:
      - in: query
        name: cohort_id
        schema:
          type: integer
        description: 기수 ID 필터
      - in: query
        name: exam_id
        schema:
          type: integer
        description: 시험 ID 필터
      - in: query
        name: order
        schema:
          type: string
        description: 정렬 순서 (asc, desc)
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: search_keyword
        schema:
          type: string
        description: 수강생 이름/닉네임 검색어
      - in: query
        name: size
        schema:
          type: integer
        description: 페이지당 아이템 개수
      - in: query
        name: sort
        schema:
          type: string
        description: 정렬 필드 (score, started_at, finished_at)
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ExamSubmissionList'
          description: ''
        '400':
          description: 유효하지 않은 조회 요청입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 쪽지시험 응시 내역 조회 권한이 없습니다.
        '404':
          description: 조회된 응시 내역이 없습니다.
  /api/v1/admin/exams/submissions/{submission_id}:
    get:
      operationId: v1_admin_exams_submissions_retrieve
      description: 특정 응시 내역의 상세 정보와 채점 결과를 조회합니다.
      summary: 쪽지시험 응시 내역 상세 조회
      parameters:
      - in: path
        name: submission_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamSubmissionDetail'
          description: ''
        '400':
          description: 유효하지 않은 상세 조회 요청입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 쪽지시험 응시 상세 조회 권한이 없습니다.
        '404':
          description: 해당 응시 내역을 찾을 수 없습니다.
    delete:
      operationId: v1_admin_exams_submissions_destroy
      description: 특정 응시 내역을 삭제합니다.
      summary: 쪽지시험 응시 내역 삭제
      parameters:
      - in: path
        name: submission_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 삭제된 submission_id 반환
        '400':
          description: 유효하지 않은 응시 내역 삭제 요청입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 쪽지시험 응시 내역 삭제 권한이 없습니다.
        '404':
          description: 삭제할 응시 내역을 찾을 수 없습니다.
        '409':
          description: 응시 내역 삭제 처리 중 충돌이 발생했습니다.
  /api/v1/admin/qna/answers/{answer_id}/:
    delete:
      operationId: v1_admin_qna_answers_destroy
      summary: 어드민 답변 삭제
      parameters:
      - in: path
        name: answer_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 답변 삭제 성공
        '401':
          description: 로그인이 필요합니다.
        '403':
          description: 답변 삭제 권한이 없습니다.
        '404':
          description: 삭제할 답변을 찾을 수 없습니다.
  /api/v1/admin/qna/categories/:
    get:
      operationId: v1_admin_qna_categories_list
      description: 카테고리 타입별 필터링 및 이름 검색 기능을 제공합니다.
      summary: 어드민 카테고리 목록 조회
      parameters:
      - in: query
        name: category_type
        schema:
          type: string
        description: 카테고리 타입 (large, medium, small)
      - in: query
        name: page
        schema:
          type: integer
          default: 1
        description: 페이지 번호
      - in: query
        name: search_keyword
        schema:
          type: string
        description: 카테고리명 검색어
      - in: query
        name: size
        schema:
          type: integer
          default: 10
        description: 페이지당 항목 수
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/AdminQnaCategoryListResponse'
          description: ''
    post:
      operationId: v1_admin_qna_categories_create
      summary: 관리자 카테고리 등록
      tags:
      - Admin_qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdminCategoryRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AdminCategoryRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AdminCategoryRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminCategory'
              examples:
                SuccessResponseExample:
                  value:
                    category_id: 55
                    name: FastAPI
                    category_type: small
                    parent_id: 12
                    created_at: '2025-03-03 14:11:22'
                  summary: Success Response Example
          description: ''
  /api/v1/admin/qna/categories/{category_id}/:
    delete:
      operationId: v1_admin_qna_categories_destroy
      description: 카테고리를 삭제하고 관련 질문을 일반질문 카테고리로 이관합니다.
      summary: 관리자 카테고리 삭제
      parameters:
      - in: path
        name: category_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 카테고리 삭제 성공
        '404':
          description: 삭제할 카테고리를 찾을 수 없습니다.
        '409':
          description: 기본 카테고리는 삭제할 수 없습니다.
  /api/v1/admin/qna/questions/:
    get:
      operationId: v1_admin_qna_questions_retrieve
      summary: 관리자 질의응답 목록 조회
      parameters:
      - in: query
        name: answer_status
        schema:
          type: string
      - in: query
        name: category_id
        schema:
          type: integer
      - in: query
        name: page
        schema:
          type: integer
          default: 1
      - in: query
        name: search_keyword
        schema:
          type: string
      - in: query
        name: size
        schema:
          type: integer
          default: 20
      - in: query
        name: sort
        schema:
          type: string
          default: latest
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminQuestionListResponse'
          description: ''
  /api/v1/admin/qna/questions/{question_id}/:
    get:
      operationId: v1_admin_qna_questions_retrieve_2
      summary: 관리자 질의응답 상세 조회
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminQuestionDetail'
          description: ''
    delete:
      operationId: v1_admin_qna_questions_destroy
      summary: 어드민 질의응답 삭제
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 질문 삭제 성공
        '401':
          description: 로그인이 필요합니다.
        '403':
          description: 질의응답 삭제 권한이 없습니다.
        '404':
          description: 삭제할 질문을 찾을 수 없습니다.
  /api/v1/admin/student-enrollments/:
    get:
      operationId: v1_admin_student_enrollments_list
      description: '권한: 운영진(TA, OM, LC, ADMIN) 전용 API'
      summary: 관리자용 수강생 등록 요청 목록 조회 API
      parameters:
      - name: ordering
        required: false
        in: query
        description: Which field to use when ordering the results.
        schema:
          type: string
      - name: page
        required: false
        in: query
        description: A page number within the paginated result set.
        schema:
          type: integer
      - name: search
        required: false
        in: query
        description: A search term.
        schema:
          type: string
      - in: query
        name: status
        schema:
          type: string
          enum:
          - ACCEPTED
          - CANCELED
          - PENDING
          - REJECTED
        description: |-
          * `PENDING` - Pending
          * `ACCEPTED` - Accepted
          * `REJECTED` - Rejected
          * `CANCELED` - Canceled
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedAdminUserEnrollmentList'
          description: ''
  /api/v1/admin/student-enrollments/{id}/:
    get:
      operationId: v1_admin_student_enrollments_retrieve
      description: '권한: 운영진(TA, OM, LC, ADMIN) 전용 API'
      summary: 관리자용 수강생 등록 요청 목록 상세조회 API
      parameters:
      - in: path
        name: id
        schema:
          type: integer
        description: A unique integer value identifying this enrollment request.
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AdminUserEnrollment'
          description: ''
  /api/v1/admin/student-enrollments/accept/:
    post:
      operationId: v1_admin_student_enrollments_accept_create
      description: |-
        관리자 권한을 가진 유저는 수강 등록 신청을 승인할 수 있습니다.

        조회된 목록들에서 승인할 신청 내역들을 선택한 후 페이지 내에 위치한 선택 항목 승인 버튼을 클릭하여 일괄 승인할 수 있습니다.
      summary: 관리자용 수강생 등록 요청 승인 API
      tags:
      - Admin_accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentAcceptRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentAcceptRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentAcceptRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                description: OK
                example:
                  detail: 수강생 등록 신청들에 대한 승인 요청이 처리되었습니다.
          description: ''
        '400':
          description: 이 필드는 필수 항목입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/student-enrollments/reject/:
    post:
      operationId: v1_admin_student_enrollments_reject_create
      description: |-
        관리자 권한을 가진 유저는 수강 등록 신청을 반려할 수 있습니다.

        조회된 목록들에서 반려할 신청 내역들을 선택한 후 페이지 내에 위치한 선택 항목 반려 버튼을 클릭하여 일괄 반려할 수 있습니다.
      summary: 관리자용 수강생 등록 요청 반려 API
      tags:
      - Admin_accounts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentRejectRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentRejectRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AdminEnrollmentRejectRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                description: OK
                example:
                  detail: 수강생 등록 신청들에 대한 반려 요청이 처리되었습니다.
          description: ''
        '400':
          description: 이 필드는 필수 항목입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/student-enrollments/trends/:
    get:
      operationId: v1_admin_student_enrollments_trends_retrieve
      summary: 어드민 페이지 수강 등록 추세 분석 API
      parameters:
      - in: query
        name: interval
        schema:
          enum:
          - monthly
          - yearly
          type: string
          minLength: 1
        description: |-
          * `monthly` - monthly
          * `yearly` - yearly
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StudentEnrollmentTrendResponse'
          description: ''
        '400':
          description: interval 값이 올바르지 않습니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
  /api/v1/admin/students/:
    get:
      operationId: v1_admin_students_list
      description: 관리자가 학생들의 정보와 현재 수강 중인 기수/코스 데이터를 목록으로 조회합니다.
      summary: 관리자용 학생 목록 조회
      parameters:
      - name: ordering
        required: false
        in: query
        description: Which field to use when ordering the results.
        schema:
          type: string
      - name: page
        required: false
        in: query
        description: A page number within the paginated result set.
        schema:
          type: integer
      - in: query
        name: role
        schema:
          type: string
          title: 권한
          enum:
          - ADMIN
          - LC
          - OM
          - STUDENT
          - TA
          - USER
        description: |-
          * `USER` - User
          * `STUDENT` - Student
          * `TA` - Ta
          * `OM` - Om
          * `LC` - Lc
          * `ADMIN` - Admin
      - name: search
        required: false
        in: query
        description: A search term.
        schema:
          type: string
      - in: query
        name: status
        schema:
          type: string
          enum:
          - ACTIVATED
          - DEACTIVATED
          - WITHDREW
        description: |-
          * `ACTIVATED` - Activated
          * `DEACTIVATED` - Deactivated
          * `WITHDREW` - Withdrew
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedStudentManagerList'
          description: ''
  /api/v1/admin/students/{id}/:
    get:
      operationId: v1_admin_students_retrieve
      parameters:
      - in: path
        name: id
        schema:
          type: integer
        description: A unique integer value identifying this user.
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/StudentManager'
          description: ''
  /api/v1/admin/students/{student_id}/scores:
    get:
      operationId: v1_admin_students_scores_retrieve
      description: 특정 학생의 과목별 점수를 조회합니다.
      summary: 학생별 과목 점수 조회
      parameters:
      - in: path
        name: student_id
        schema:
          type: integer
        required: true
      tags:
      - Course
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/StudentSubjectScoreItem'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Not Found
  /api/v1/admin/subjects/{subject_id}/scatter:
    get:
      operationId: v1_admin_subjects_scatter_retrieve
      summary: 어드민 과목별 학습시간/점수 산점도 조회
      parameters:
      - in: path
        name: subject_id
        schema:
          type: integer
        description: 과목 ID
        required: true
      tags:
      - Course
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SubjectScatterPoint'
              examples:
                ResponseExample:
                  value:
                  - - time: 1.5
                      score: 95
                    - time: 2.8
                      score: 98
                    - time: 3.1
                      score: 100
                    - time: 1.2
                      score: 85
                    - time: 2.1
                      score: 90
                  summary: Response Example
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
          description: Not Found
  /api/v1/admin/withdrawals/:
    get:
      operationId: v1_admin_withdrawals_retrieve
      description: withdrawal_id 유무에 따라 상세 조회(DetailSerializer) 또는 페이징된 목록 조회(ListSerializer)를
        수행합니다.
      summary: 어드민 탈퇴 회원 목록/상세 조회
      parameters:
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: role
        schema:
          type: string
        description: 역할 필터
      - in: query
        name: search
        schema:
          type: string
        description: 이름 검색
      - in: query
        name: sort
        schema:
          type: string
        description: 정렬 (latest/oldest)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 조회 성공
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 회원탈퇴 정보를 찾을 수 없습니다.
    delete:
      operationId: v1_admin_withdrawals_destroy
      description: 특정 탈퇴 기록을 삭제하여 유저의 상태를 활성으로 복구합니다.
      summary: 어드민 탈퇴 회원 복구(탈퇴 취소)
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 회원 탈퇴 취소처리 완료.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 회원탈퇴 정보를 찾을 수 없습니다.
  /api/v1/admin/withdrawals/{withdrawal_id}/:
    get:
      operationId: v1_admin_withdrawals_retrieve_2
      description: withdrawal_id 유무에 따라 상세 조회(DetailSerializer) 또는 페이징된 목록 조회(ListSerializer)를
        수행합니다.
      summary: 어드민 탈퇴 회원 목록/상세 조회
      parameters:
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: role
        schema:
          type: string
        description: 역할 필터
      - in: query
        name: search
        schema:
          type: string
        description: 이름 검색
      - in: query
        name: sort
        schema:
          type: string
        description: 정렬 (latest/oldest)
      - in: path
        name: withdrawal_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 조회 성공
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 회원탈퇴 정보를 찾을 수 없습니다.
    delete:
      operationId: v1_admin_withdrawals_destroy_2
      description: 특정 탈퇴 기록을 삭제하여 유저의 상태를 활성으로 복구합니다.
      summary: 어드민 탈퇴 회원 복구(탈퇴 취소)
      parameters:
      - in: path
        name: withdrawal_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_accounts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 회원 탈퇴 취소처리 완료.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 회원탈퇴 정보를 찾을 수 없습니다.
  /api/v1/chatbot/sessions/:
    get:
      operationId: v1_chatbot_sessions_list
      description: QnA 챗봇 세션 목록 조회 / 생성
      summary: QnA 챗봇 세션 목록 조회
      parameters:
      - in: query
        name: cursor
        schema:
          type: string
        description: 커서
      - in: query
        name: page_size
        schema:
          type: integer
          default: 10
        description: 페이지 크기
      tags:
      - Chatbot
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChatbotSession'
          description: ''
    post:
      operationId: v1_chatbot_sessions_create
      description: QnA 챗봇 세션 목록 조회 / 생성
      summary: QnA 챗봇 세션 생성
      tags:
      - Chatbot
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatbotSessionCreateRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ChatbotSessionCreateRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ChatbotSessionCreateRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatbotSession'
          description: ''
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ChatbotSession'
          description: ''
  /api/v1/chatbot/sessions/{session_id}/:
    delete:
      operationId: v1_chatbot_sessions_destroy
      description: QnA 챗봇 세션 삭제
      summary: QnA 챗봇 세션 삭제
      parameters:
      - in: path
        name: session_id
        schema:
          type: integer
        required: true
      tags:
      - Chatbot
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '204':
          description: 삭제 성공
        '404':
          description: 세션이 없음
  /api/v1/chatbot/sessions/{session_id}/completions/:
    get:
      operationId: v1_chatbot_sessions_completions_list
      description: QnA 챗봇 대화내역 조회 / 대화 생성 (SSE 스트리밍)
      summary: QnA 챗봇 대화내역 조회
      parameters:
      - in: query
        name: cursor
        schema:
          type: string
        description: 커서
      - in: query
        name: page_size
        schema:
          type: integer
          default: 10
        description: 페이지 크기
      - in: path
        name: session_id
        schema:
          type: integer
        required: true
      tags:
      - Chatbot
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChatbotCompletion'
          description: ''
    post:
      operationId: v1_chatbot_sessions_completions_create
      description: QnA 챗봇 대화내역 조회 / 대화 생성 (SSE 스트리밍)
      summary: QnA 챗봇 대화 생성 (SSE 스트리밍)
      parameters:
      - in: path
        name: session_id
        schema:
          type: integer
        required: true
      tags:
      - Chatbot
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                type: string
          description: 'SSE 스트리밍: data: {"content": "텍스트"}\n\n → data: [DONE]\n\n'
        '400':
          description: 잘못된 요청
        '404':
          description: 세션을 찾을 수 없음
        '429':
          description: 이전 질문 답변 중
  /api/v1/chatbot/support/:
    post:
      operationId: v1_chatbot_support_create
      description: CS 상담 챗봇 (1회성 SSE 스트리밍, 세션 저장 없음)
      summary: CS 상담 챗봇 (1회성 스트리밍)
      tags:
      - Chatbot
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ChatbotCompletionRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: string
          description: 'SSE 스트리밍: data: {"content": "텍스트"}\n\n → data: [DONE]\n\n'
  /api/v1/course:
    get:
      operationId: v1_course_list
      summary: 과정 리스트 조회 API
      tags:
      - Course
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CourseListItem'
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: ''
  /api/v1/exams/deployments:
    get:
      operationId: v1_exams_deployments_retrieve
      summary: 쪽지시험 목록 조회 API
      parameters:
      - in: query
        name: page
        schema:
          type: integer
          minimum: 1
          default: 1
      - in: query
        name: status
        schema:
          enum:
          - all
          - done
          - pending
          type: string
          default: all
          minLength: 1
        description: |-
          * `all` - all
          * `done` - done
          * `pending` - pending
      tags:
      - Exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DeploymentListResponse'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
  /api/v1/exams/deployments/{deployment_id}:
    get:
      operationId: v1_exams_deployments_retrieve_2
      summary: 쪽지시험 응시 문제풀이 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DeploymentDetailResponse'
          description: OK
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
        '410':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Gone
  /api/v1/exams/deployments/{deployment_id}/check-code:
    post:
      operationId: v1_exams_deployments_check_code_create
      summary: 쪽지시험 참가 코드 검증 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/DeploymentCheckCodeRequestRequest'
            examples:
              RequestExample:
                value:
                  code: '124312'
                summary: request example
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/DeploymentCheckCodeRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/DeploymentCheckCodeRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '204':
          description: No Content
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailField'
              examples:
                CodeMismatchExample:
                  value:
                    error_detail: 응시 코드가 일치하지 않습니다.
                  summary: code mismatch example
                FieldErrorExample:
                  value:
                    error_detail:
                      code: 이 필드는 필수 항목입니다.
                  summary: field error example
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
        '423':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Locked
  /api/v1/exams/deployments/{deployment_id}/status:
    get:
      operationId: v1_exams_deployments_status_retrieve
      summary: 쪽지시험 상태 확인 API
      parameters:
      - in: path
        name: deployment_id
        schema:
          type: integer
        required: true
      tags:
      - Exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/DeploymentStatusResponse'
          description: OK
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Unauthorized
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Forbidden
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Not Found
        '410':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetailString'
          description: Gone
  /api/v1/exams/submissions:
    post:
      operationId: v1_exams_submissions_create
      description: 시험 응시를 완료하고 답안을 제출합니다. 제출 시 자동 채점이 이루어집니다.
      summary: 쪽지시험 제출 API
      tags:
      - Exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamSubmissionCreateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/ExamSubmissionCreateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamSubmissionCreateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamSubmissionCreateResponse'
          description: ''
        '400':
          description: 유효하지 않은 시험 응시 세션입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 해당 시험 정보를 찾을 수 없습니다.
        '409':
          description: 이미 제출된 시험입니다.
  /api/v1/exams/submissions/{submission_id}:
    get:
      operationId: v1_exams_submissions_retrieve
      description: 특정 제출 건에 대한 상세 결과와 채점 내역을 조회합니다.
      summary: 쪽지시험 결과 확인 API
      parameters:
      - in: path
        name: submission_id
        schema:
          type: string
        required: true
      tags:
      - Exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamSubmissionResult'
          description: ''
        '400':
          description: 유효하지 않은 시험 응시 세션입니다.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 해당 시험 정보를 찾을 수 없습니다.
  /api/v1/posts:
    get:
      operationId: v1_posts_list
      description: 게시글 list
      summary: 게시글 조회
      parameters:
      - in: query
        name: category_id
        schema:
          type: integer
        description: 카테고리 ID
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: page_size
        schema:
          type: integer
        description: 페이지 크기
      - in: query
        name: search
        schema:
          type: string
        description: 검색어
      - in: query
        name: search_filter
        schema:
          type: string
          enum:
          - author
          - content
          - title
          - title_or_content
        description: 검색 기준
      - in: query
        name: sort
        schema:
          type: string
          enum:
          - latest
          - most_comments
          - most_likes
          - most_views
          - oldest
        description: 정렬 기준
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PostList'
              examples:
                게시글조회예시:
                  value:
                  - count: 100
                    next: http://api.ozcoding.site/api/v1/posts?page=2&page_size=10
                    previous: null
                    results:
                    - id: 1
                      author:
                        id: 1
                        nickname: testuser
                        profile_img_url: https://example.com/uploads/images/users/profiles/image.png
                      title: 테스트 게시글 1번
                      thumbnail_img_url: https://example.com/uploads/images/posts/first-image.png
                      content_preview: 그냥 작성한 게시글 1번 입니다. 게시글 본문 내용이 50글자 내로 생략된 형태로
                        제공됩니다.
                      comment_count: 100
                      view_count: 100
                      like_count: 100
                      created_at: '2025-10-30T14:01:57.505250+09:00'
                      updated_at: '2025-10-30T14:01:57.505250+09:00'
                      category_name: 자유게시판
                  summary: 게시글 조회 예시
          description: ''
    post:
      operationId: v1_posts_create
      description: 커뮤니 게시글 작성 API
      summary: 게시글 등록
      tags:
      - Posts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCreateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PostCreateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PostCreateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Created:
                  value:
                    detail: 게시글이 성공적으로 등록되었습니다.
                    pk: 1
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                BadRequest:
                  value:
                    error_detail:
                      title:
                      - 이 필드는 필수 항목입니다.
                  summary: Bad Request
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Unauthorized:
                  value:
                    error_detail: 자격 인증 데이터가 제공되 않았습니다.
          description: ''
  /api/v1/posts/{post_id}:
    get:
      operationId: v1_posts_retrieve
      description: 게시글에 대한 상세한 정보 조회
      summary: 게시글 상세 조회
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostDetail'
              examples:
                게시글상세조회성공예시:
                  value:
                    id: 1
                    author:
                      id: 1
                      nickname: testuser
                      profile_img_url: https://example.com/profile.png
                    category_id: '1'
                    category_name: 자유게시판
                    title: 테스트 게시글
                    content: 게시글 내용입니다.
                    view_count: 10
                    like_count: 3
                    created_at: '2026-03-01T12:00:00Z'
                    updated_at: '2026-03-01T12:00:00Z'
                  summary: 게시글 상세 조회 성공 예시
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostDetailNotFound'
          description: ''
    put:
      operationId: v1_posts_update
      description: 게시글을 수정합니다.
      summary: 게시글 수정
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PostUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PostUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostDetail'
              examples:
                Ok:
                  value:
                    id: 1
                    title: 수정된 게시글 본문입니다. 마크다운 허용
                    category: 테스트 게시판
          description: ''
        '400':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                BadRequest:
                  value:
                    error_detail:
                      title:
                      - 이 필드는 필수 항목입니다.
                  summary: Bad Request
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Unauthorized:
                  value:
                    error_detail: 자격 인증 데이터가 제공되 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Forbidden:
                  value:
                    error_detail: 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostDetailNotFound'
              examples:
                NotFound:
                  value:
                    error_detail: 해당 게시글을 찾을 수 없습니다.
                  summary: Not Found
          description: ''
    delete:
      operationId: v1_posts_destroy
      description: 게시글을 삭제합니다.
      summary: 게시글 삭제
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Ok:
                  value:
                    detail: 게시글이 삭제되었습니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Unauthorized:
                  value:
                    error_detail: 자격 인증 데이터가 제공되 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                type: object
                additionalProperties: {}
              examples:
                Forbidden:
                  value:
                    error_detail: 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostDetailNotFound'
              examples:
                NotFound:
                  value:
                    error_detail: 해당 게시글을 찾을 수 없습니다.
                  summary: Not Found
          description: ''
  /api/v1/posts/{post_id}/comments:
    get:
      operationId: v1_posts_comments_list
      description: 특정 게시글의 모든 댓글 list
      summary: 댓글 목록
      parameters:
      - in: query
        name: ordering
        schema:
          type: string
          enum:
          - old
          - recent
          default: recent
        description: '정렬 순서 (recent: 최신순, old: 오래된순)'
      - name: page
        required: false
        in: query
        description: A page number within the paginated result set.
        schema:
          type: integer
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedPostCommentList'
              examples:
                댓글목록예시:
                  value:
                    count: 123
                    next: http://api.example.org/accounts/?page=4
                    previous: http://api.example.org/accounts/?page=2
                    results:
                    - id: 1
                      content: 첫 테스트
                      author:
                        id: 1
                        nickname: 테스트
                        profile_img_url: https://example.com/uploads/images/users/profiles/image.png
                      created_at: 2026-03-10T17:00:000
                      updated_at: 2026-03-10T18:00:000
                  summary: 댓글 목록 예시
                  description: 정상응답 데이터
          description: ''
    post:
      operationId: v1_posts_comments_create
      description: 댓글 작성 api
      summary: 댓글 작성
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
            examples:
              댓글등록예시:
                value:
                  content: 테스트 댓글
                summary: 댓글 등록 예시
                description: 정상응답 데이터
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          description: 댓글이 등록되었습니다.
        '400':
          description: 필수 항목 데이터가 빠짐.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '404':
          description: 해당 게시글을 찾을 수 없습니다.
  /api/v1/posts/{post_id}/comments/{comment_id}:
    put:
      operationId: v1_posts_comments_update
      description: 댓글 수정 api
      summary: 댓글 수정
      parameters:
      - in: path
        name: comment_id
        schema:
          type: integer
        required: true
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PostCommentRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 수정된 데이터 반환
        '400':
          description: 필수 항목 데이터가 빠짐.
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 해당 댓글을 찾을 수 없습니다.
    delete:
      operationId: v1_posts_comments_destroy
      summary: 댓글 삭제
      parameters:
      - in: path
        name: comment_id
        schema:
          type: integer
        required: true
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 댓글이 삭제되었습니다
        '401':
          description: 자격 인증 데이터가 제공되지 않았습니다.
        '403':
          description: 권한이 없습니다.
        '404':
          description: 해당 댓글을 찾을 수 없습니다.
  /api/v1/posts/{post_id}/like:
    post:
      operationId: v1_posts_like_create
      summary: 게시글 좋아요
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostLikeResponse'
          description: ''
        '404':
          description: 게시글을 찾을 수 없습니다.
    delete:
      operationId: v1_posts_like_destroy
      summary: 게시글 좋아요 취소
      parameters:
      - in: path
        name: post_id
        schema:
          type: integer
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostLikeResponse'
          description: ''
        '404':
          description: 게시글을 찾을 수 없습니다.
  /api/v1/posts/categories:
    get:
      operationId: v1_posts_category_list
      description: 커뮤니티 게시글 작성 시 선택 가능한 카테고리 목록을 조회합니다. 활성 카테고리 DB 조회 데이터를 serializer로
        직렬화하여 명세와 동일한 응답 구조(id, name)를 제공합니다.
      summary: 게시글 카테고리 목록 조회 API
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/PostCategoryListSpec'
              examples:
                Success:
                  value:
                  - - id: 1
                      name: 공지사항
                    - id: 2
                      name: 자유 게시판
                    - id: 3
                      name: 일상 공유
                    - id: 4
                      name: 개발 지식 공유
                    - id: 5
                      name: 취업 정보 공유
                    - id: 6
                      name: 프로젝트 구인
                  summary: success
          description: ''
  /api/v1/posts/user/search:
    get:
      operationId: v1_posts_user_search_retrieve
      description: 댓글 태그 기능
      summary: 댓글 태그
      parameters:
      - in: query
        name: nickname
        schema:
          type: string
        required: true
      tags:
      - Posts
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PostCommentUserSearch'
          description: ''
  /api/v1/qna/answers/{id}:
    put:
      operationId: v1_qna_answers_update
      summary: 답변 수정
      parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 답변 수정 성공
        '400':
          description: 유효하지 않은 답변 수정 요청입니다.
        '401':
          description: 로그인한 사용자만 답변을 수정할 수 있습니다.
        '403':
          description: 본인이 작성한 답변만 수정할 수 있습니다.
        '404':
          description: 해당 답변을 찾을 수 없습니다.
  /api/v1/qna/answers/{id}/accept:
    post:
      operationId: v1_qna_answers_accept_create
      summary: 답변 채택
      parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: 채택 성공
        '401':
          description: 로그인한 사용자만 답변을 채택할 수 있습니다.
        '403':
          description: 본인이 작성한 질문의 답변만 채택할 수 있습니다.
        '404':
          description: 해당 질문 또는 답변을 찾을 수 없습니다.
        '409':
          description: 이미 채택된 답변이 존재합니다.
  /api/v1/qna/answers/{id}/comments:
    post:
      operationId: v1_qna_answers_comments_create
      summary: 답변 댓글 등록
      parameters:
      - in: path
        name: id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CommentCreateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/CommentCreateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/CommentCreateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          description: 댓글 등록 성공
        '400':
          description: 댓글 내용은 1~500자 사이로 입력해야 합니다.
        '401':
          description: 로그인한 사용자만 댓글을 작성할 수 있습니다.
        '403':
          description: 댓글 작성 권한이 없습니다.
        '404':
          description: 해당 답변을 찾을 수 없습니다.
  /api/v1/qna/answers/presigned-url:
    put:
      operationId: v1_qna_answers_presigned_url_update
      summary: 답변 이미지 Presigned URL 발급
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: Presigned URL 발급 성공
        '400':
          description: 지원하지 않는 파일 형식입니다.
        '401':
          description: 로그인한 사용자만 요청할 수 있습니다.
  /api/v1/qna/categories/:
    get:
      operationId: v1_qna_categories_list
      description: 수강생 권한을 가진 유저가 카테고리 목록을 조회합니다.
      summary: 유저 카테고리 목록 조회
      tags:
      - Qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/UserCategory'
          description: ''
  /api/v1/qna/questions/:
    get:
      operationId: v1_qna_questions_list
      description: 질문 목록을 조회하며, 전역 설정된 페이지네이션이 적용됩니다.
      summary: 질문 조회
      parameters:
      - in: query
        name: answer_status
        schema:
          type: string
        description: 답변 상태(answered/unanswered)
      - in: query
        name: category_id
        schema:
          type: integer
        description: 카테고리 ID필터
      - in: query
        name: page
        schema:
          type: integer
        description: 페이지 번호
      - in: query
        name: search
        schema:
          type: string
        description: 검색어
      - in: query
        name: size
        schema:
          type: integer
        description: 한 페이지 당 보여줄 개수
      - in: query
        name: sort
        schema:
          type: string
        description: '정렬(latest: 최신순, views: 조회수순)'
      tags:
      - Qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/QuestionList'
          description: ''
    post:
      operationId: v1_qna_questions_create
      description: 새로운 질문을 등록합니다.
      summary: 질문 등록
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuestionCreateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/QuestionCreateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/QuestionCreateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionCreateResponse'
          description: ''
  /api/v1/qna/questions/{question_id}/:
    get:
      operationId: v1_qna_questions_retrieve
      description: 질문 상세조회을 조회하고 조회수를 1 올립니다.
      summary: 질문 상세 조회
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      - {}
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionListDetail'
          description: ''
    put:
      operationId: v1_qna_questions_update
      description: 기존 질문 내용을 수정합니다.
      summary: 질문 수정
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/QuestionUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/QuestionUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/QuestionUpdateRequest'
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/QuestionUpdateResponse'
          description: ''
  /api/v1/qna/questions/{question_id}/ai-answer:
    get:
      operationId: v1_qna_questions_ai_answer_retrieve
      summary: AI 답변 생성/조회
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          description: AI 답변 생성/조회 성공
        '401':
          description: 로그인한 사용자만 요청할 수 있습니다.
        '404':
          description: 질문 데이터를 찾을 수 없습니다.
        '409':
          description: 이미 AI가 답변을 생성했습니다.
  /api/v1/qna/questions/{question_id}/answers:
    post:
      operationId: v1_qna_questions_answers_create
      summary: 답변 등록
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/AnswerCreateUpdateRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '201':
          description: 답변 등록 성공
        '400':
          description: 유효하지 않은 답변 등록 요청입니다.
        '401':
          description: 로그인한 사용자만 답변을 작성할 수 있습니다.
        '403':
          description: 답변 작성 권한이 없습니다.
        '404':
          description: 해당 질문을 찾을 수 없습니다.
  /api/v1/qna/questions/presigned-url:
    put:
      operationId: v1_qna_questions_presigned_url_update
      summary: 질문 이미지 Presigned URL 발급
      tags:
      - Qna
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/PresignedUrlRequestRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          description: Presigned URL 발급 성공
        '400':
          description: 지원하지 않는 파일 형식입니다.
        '401':
          description: 로그인한 사용자만 요청할 수 있습니다.
  /api/v1/questions/{question_id}:
    put:
      operationId: v1_questions_update
      summary: 쪽지시험 문제 수정
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
          multipart/form-data:
            schema:
              $ref: '#/components/schemas/ExamQuestionRequest'
        required: true
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionUpdateResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 수정 데이터입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 수정 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 수정하려는 문제 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 시험 문제 수 제한 또는 총 배점을 초과하여 문제를 수정할 수 없습니다.
          description: ''
    delete:
      operationId: v1_questions_destroy
      summary: 쪽지시험 문제 삭제
      parameters:
      - in: path
        name: question_id
        schema:
          type: integer
        required: true
      tags:
      - Admin_exams
      security:
      - jwtAuth: []
      - BearerAuth:
          type: http
          scheme: bearer
          bearerFormat: JWT
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ExamQuestionDeleteResponse'
          description: ''
        '400':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '400':
                  value:
                    error_detail: 유효하지 않은 문제 삭제 요청입니다.
          description: ''
        '401':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '401':
                  value:
                    error_detail: 자격 인증 데이터가 제공되지 않았습니다.
          description: ''
        '403':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '403':
                  value:
                    error_detail: 쪽지시험 문제 삭제 권한이 없습니다.
          description: ''
        '404':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '404':
                  value:
                    error_detail: 삭제할 문제 정보를 찾을 수 없습니다.
          description: ''
        '409':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorDetail'
              examples:
                '409':
                  value:
                    error_detail: 쪽지시험 문제 삭제 처리 중 충돌이 발생했습니다.
          description: ''
components:
  schemas:
    AccountRecoveryRequest:
      type: object
      properties:
        email_token:
          type: string
          minLength: 1
      required:
      - email_token
    AdminAnalyticsTrend:
      type: object
      properties:
        interval:
          $ref: '#/components/schemas/IntervalEnum'
        from_date:
          type: string
          format: date
        to_date:
          type: string
          format: date
        total:
          type: integer
        items:
          type: array
          items:
            $ref: '#/components/schemas/AnalyticsItem'
      required:
      - from_date
      - interval
      - items
      - to_date
      - total
    AdminAnswerAuthor:
      type: object
      properties:
        profile_img_url:
          type: string
          readOnly: true
        nickname:
          type: string
          readOnly: true
        role_title:
          type: string
          readOnly: true
        course_generation:
          type: string
          readOnly: true
      required:
      - course_generation
      - nickname
      - profile_img_url
      - role_title
    AdminAnswerList:
      type: object
      properties:
        answer_id:
          type: integer
        author:
          allOf:
          - $ref: '#/components/schemas/AdminAnswerAuthor'
          readOnly: true
        content:
          type: string
        is_adopted:
          type: boolean
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required:
      - answer_id
      - author
      - content
      - created_at
      - updated_at
    AdminCategory:
      type: object
      properties:
        category_id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 15
        parent_id:
          type: integer
          nullable: true
          description: 부모 카테고리 ID
        created_at:
          type: string
          format: date-time
          readOnly: true
      required:
      - category_id
      - created_at
      - name
    AdminCategoryRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 15
        category_type:
          allOf:
          - $ref: '#/components/schemas/CategoryTypeEnum'
          writeOnly: true
          description: |-
            카테고리 종류 (대분류, 중분류, 소분류)

            * `large` - large
            * `medium` - medium
            * `small` - small
        parent_id:
          type: integer
          nullable: true
          description: 부모 카테고리 ID
      required:
      - category_type
      - name
    AdminEnrollmentAcceptRequest:
      type: object
      properties:
        enrollments:
          type: array
          items:
            type: integer
      required:
      - enrollments
    AdminEnrollmentRejectRequest:
      type: object
      properties:
        enrollments:
          type: array
          items:
            type: integer
      required:
      - enrollments
    AdminQnaCategoryListResponse:
      type: object
      properties:
        category_id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 15
        category_type:
          type: string
          readOnly: true
        parent_category:
          type: string
          readOnly: true
        child_categories:
          type: array
          items:
            type: string
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - category_id
      - category_type
      - child_categories
      - created_at
      - name
      - parent_category
      - updated_at
    AdminQuestionAuthor:
      type: object
      properties:
        profile_img_url:
          type: string
          readOnly: true
        nickname:
          type: string
          readOnly: true
        course_generation:
          type: string
          readOnly: true
      required:
      - course_generation
      - nickname
      - profile_img_url
    AdminQuestionDetail:
      type: object
      properties:
        question_id:
          type: integer
        title:
          type: string
          maxLength: 50
        content:
          type: string
        images:
          type: array
          items:
            type: string
          readOnly: true
        author:
          allOf:
          - $ref: '#/components/schemas/AdminQuestionAuthor'
          readOnly: true
        view_count:
          type: integer
          maximum: 2147483647
          minimum: -2147483648
        has_answer:
          type: boolean
          readOnly: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        answers:
          type: array
          items:
            $ref: '#/components/schemas/AdminAnswerList'
          readOnly: true
      required:
      - answers
      - author
      - content
      - created_at
      - has_answer
      - images
      - question_id
      - title
      - updated_at
    AdminQuestionList:
      type: object
      properties:
        question_id:
          type: integer
        title:
          type: string
          maxLength: 50
        category_path:
          type: string
          readOnly: true
        content_preview:
          type: string
          readOnly: true
        nickname:
          type: string
          readOnly: true
        view_count:
          type: integer
          maximum: 2147483647
          minimum: -2147483648
        has_answer:
          type: boolean
          readOnly: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required:
      - category_path
      - content_preview
      - created_at
      - has_answer
      - nickname
      - question_id
      - title
      - updated_at
    AdminQuestionListResponse:
      type: object
      properties:
        page:
          type: integer
        size:
          type: integer
        total_count:
          type: integer
          nullable: true
        questions:
          type: array
          items:
            $ref: '#/components/schemas/AdminQuestionList'
          nullable: true
      required:
      - page
      - size
    AdminUserEnrollment:
      type: object
      description: 어드민 수강생 등록 요청 목록 조회 API용
      properties:
        id:
          type: integer
          readOnly: true
        user:
          allOf:
          - $ref: '#/components/schemas/EnrollmentUser'
          readOnly: true
        cohort:
          allOf:
          - $ref: '#/components/schemas/EnrollmentCohort'
          readOnly: true
        course:
          allOf:
          - $ref: '#/components/schemas/EnrollmentCourse'
          readOnly: true
        status:
          type: string
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - cohort
      - course
      - created_at
      - id
      - status
      - user
    AdminUserSearchDetail:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        email:
          type: string
          format: email
          title: 이메일
          maxLength: 255
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        name:
          type: string
          title: 이름
          maxLength: 30
        phone_number:
          type: string
          title: 휴대폰번호
          maxLength: 20
        birthday:
          type: string
          format: date
          title: 생년월일
        gender:
          allOf:
          - $ref: '#/components/schemas/GenderE07Enum'
          title: 성별
        status:
          $ref: '#/components/schemas/Status920Enum'
        role:
          allOf:
          - $ref: '#/components/schemas/RoleF6eEnum'
          title: 권한
        profile_img_url:
          type: string
          nullable: true
          maxLength: 255
        assigned_courses:
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - assigned_courses
      - birthday
      - created_at
      - email
      - gender
      - id
      - name
      - nickname
      - phone_number
    AdminUserSearchList:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        email:
          type: string
          format: email
          title: 이메일
          maxLength: 255
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        name:
          type: string
          title: 이름
          maxLength: 30
        birthday:
          type: string
          format: date
          title: 생년월일
        status:
          $ref: '#/components/schemas/Status920Enum'
        role:
          allOf:
          - $ref: '#/components/schemas/RoleF6eEnum'
          title: 권한
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - birthday
      - created_at
      - email
      - id
      - name
      - nickname
    AnalyticsItem:
      type: object
      properties:
        period:
          type: string
        count:
          type: integer
      required:
      - count
      - period
    AnswerComment:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        author:
          allOf:
          - $ref: '#/components/schemas/Author'
          readOnly: true
        content:
          type: string
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - author
      - content
      - created_at
      - id
    AnswerCreateUpdateRequest:
      type: object
      properties:
        content:
          type: string
          minLength: 1
        image_urls:
          type: array
          items:
            type: string
            format: uri
            minLength: 1
      required:
      - content
    AnswerImages:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        img_url:
          type: string
          readOnly: true
      required:
      - id
      - img_url
    AnswerItemRequest:
      type: object
      properties:
        question_id:
          type: integer
        type:
          type: string
          minLength: 1
        submitted_answer: {}
      required:
      - question_id
      - submitted_answer
      - type
    AnswerResponse:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        author:
          allOf:
          - $ref: '#/components/schemas/Author'
          readOnly: true
        content:
          type: string
          readOnly: true
        is_adopted:
          type: boolean
          readOnly: true
        images:
          type: array
          items:
            $ref: '#/components/schemas/AnswerImages'
          readOnly: true
        comments:
          type: array
          items:
            $ref: '#/components/schemas/AnswerComment'
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - author
      - comments
      - content
      - created_at
      - id
      - images
      - is_adopted
      - updated_at
    Author:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        profile_image_url:
          type: string
          nullable: true
          readOnly: true
        course_name:
          type: string
          readOnly: true
        cohort_name:
          type: string
          readOnly: true
      required:
      - cohort_name
      - course_name
      - id
      - nickname
      - profile_image_url
    AvailableCourse:
      type: object
      properties:
        cohort:
          $ref: '#/components/schemas/CohortSimple'
        course:
          $ref: '#/components/schemas/CourseSimple'
      required:
      - cohort
      - course
    Category:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        depth:
          type: integer
          readOnly: true
        names:
          type: array
          items:
            type: string
          readOnly: true
      required:
      - depth
      - id
      - names
    CategoryTypeEnum:
      enum:
      - large
      - medium
      - small
      type: string
      description: |-
        * `large` - large
        * `medium` - medium
        * `small` - small
    ChatbotCompletion:
      type: object
      description: '대화내역 조회 응답용 — 명세서 필드: id, message, role, created_at'
      properties:
        id:
          type: integer
          readOnly: true
        message:
          type: string
          readOnly: true
          description: 챗봇과의 채팅내용
        role:
          allOf:
          - $ref: '#/components/schemas/ChatbotCompletionRoleEnum'
          readOnly: true
          description: |-
            USER(사용자) 또는 ASSISTANT(AI) 구분

            * `user` - 사용자
            * `assistant` - AI
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - created_at
      - id
      - message
      - role
    ChatbotCompletionRequestRequest:
      type: object
      description: 유저가 AI에게 보내는 채팅 메시지 검증
      properties:
        message:
          type: string
          minLength: 1
      required:
      - message
    ChatbotCompletionRoleEnum:
      enum:
      - user
      - assistant
      type: string
      description: |-
        * `user` - 사용자
        * `assistant` - AI
    ChatbotSession:
      type: object
      description: '세션 생성/목록 조회 응답용 — 명세서 필드: id, user, question_id, title, using_model,
        created_at, updated_at'
      properties:
        id:
          type: integer
          readOnly: true
        user:
          type: integer
          readOnly: true
          description: 채팅을 시작한 유저 ID
        question_id:
          type: integer
          readOnly: true
          nullable: true
        title:
          type: string
          readOnly: true
          description: AI가 요약한 세션 제목
        using_model:
          allOf:
          - $ref: '#/components/schemas/UsingModelEnum'
          readOnly: true
          description: |-
            LLM 사용 모델

            * `gemini-2.0-flash` - Gemini 2.0 Flash
            * `gemini-2.5-flash` - Gemini 2.5 Flash
            * `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - created_at
      - id
      - question_id
      - title
      - updated_at
      - user
      - using_model
    ChatbotSessionCreateRequestRequest:
      type: object
      description: 세션 생성 요청 검증용, qestion_id
      properties:
        question_id:
          type: integer
          description: 세션을 생성할 질문글의 ID
      required:
      - question_id
    CohortAvgScoreItem:
      type: object
      properties:
        name:
          type: string
        score:
          type: integer
      required:
      - name
      - score
    CohortCreateRequestRequest:
      type: object
      properties:
        number:
          type: integer
        max_student:
          type: integer
        course_id:
          type: integer
          writeOnly: true
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        status:
          $ref: '#/components/schemas/Status24dEnum'
      required:
      - course_id
      - end_date
      - max_student
      - number
      - start_date
    CohortCreateResponse:
      type: object
      properties:
        detail:
          type: string
        id:
          type: integer
      required:
      - detail
      - id
    CohortListItem:
      type: object
      properties:
        id:
          type: integer
        course_id:
          type: integer
        number:
          type: integer
        status:
          type: string
      required:
      - course_id
      - id
      - number
      - status
    CohortSimple:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        number:
          type: integer
          maximum: 32767
          minimum: -32768
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        status:
          $ref: '#/components/schemas/Status24dEnum'
      required:
      - end_date
      - id
      - number
      - start_date
    CohortStudentItem:
      type: object
      properties:
        value:
          type: string
        label:
          type: string
      required:
      - label
      - value
    CohortUpdateResponse:
      type: object
      properties:
        id:
          type: integer
        course_id:
          type: integer
        number:
          type: integer
        max_student:
          type: integer
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        status:
          type: string
        updated_at:
          type: string
          format: date-time
      required:
      - course_id
      - end_date
      - id
      - max_student
      - number
      - start_date
      - status
      - updated_at
    CommentAuthor:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        nickname:
          type: string
          title: 닉네임
          readOnly: true
        profile_img_url:
          type: string
          nullable: true
          readOnly: true
      required:
      - id
      - nickname
      - profile_img_url
    CommentCreateRequest:
      type: object
      properties:
        content:
          type: string
          minLength: 1
          maxLength: 500
      required:
      - content
    CourseCreateRequestRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 30
        tag:
          type: string
          minLength: 1
          maxLength: 3
        description:
          type: string
          maxLength: 255
        thumbnail_img_url:
          type: string
          maxLength: 255
      required:
      - name
      - tag
    CourseCreateResponse:
      type: object
      properties:
        detail:
          type: string
        id:
          type: integer
      required:
      - detail
      - id
    CourseDeleteResponse:
      type: object
      properties:
        detail:
          type: string
      required:
      - detail
    CourseListItem:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 30
        tag:
          type: string
          maxLength: 3
        thumbnail_img_url:
          type: string
          readOnly: true
      required:
      - id
      - name
      - tag
      - thumbnail_img_url
    CourseSimple:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 30
      required:
      - id
      - name
    CourseUpdateResponse:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 30
        tag:
          type: string
          maxLength: 3
        description:
          type: string
          readOnly: true
        thumbnail_img_url:
          type: string
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - description
      - id
      - name
      - tag
      - thumbnail_img_url
      - updated_at
    DeploymentCheckCodeRequestRequest:
      type: object
      properties:
        code:
          type: string
          minLength: 1
      required:
      - code
    DeploymentDetailResponse:
      type: object
      properties:
        exam_id:
          type: integer
        exam_name:
          type: string
        duration_time:
          type: integer
        elapsed_time:
          type: integer
        cheating_count:
          type: integer
        questions:
          type: array
          items:
            $ref: '#/components/schemas/DeploymentQuestionItem'
      required:
      - cheating_count
      - duration_time
      - elapsed_time
      - exam_id
      - exam_name
      - questions
    DeploymentExam:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        thumbnail_img_url:
          type: string
        subject:
          $ref: '#/components/schemas/DeploymentSubject'
      required:
      - id
      - subject
      - thumbnail_img_url
      - title
    DeploymentExamInfo:
      type: object
      properties:
        status:
          $ref: '#/components/schemas/DeploymentExamInfoStatusEnum'
        score:
          type: integer
          nullable: true
        correct_answer_count:
          type: integer
          nullable: true
      required:
      - correct_answer_count
      - score
      - status
    DeploymentExamInfoStatusEnum:
      enum:
      - done
      - pending
      type: string
      description: |-
        * `done` - done
        * `pending` - pending
    DeploymentListItem:
      type: object
      properties:
        id:
          type: integer
        submission_id:
          type: integer
          nullable: true
        exam:
          $ref: '#/components/schemas/DeploymentExam'
        question_count:
          type: integer
        total_score:
          type: integer
        exam_info:
          $ref: '#/components/schemas/DeploymentExamInfo'
        is_done:
          type: boolean
        duration_time:
          type: integer
      required:
      - duration_time
      - exam
      - exam_info
      - id
      - is_done
      - question_count
      - submission_id
      - total_score
    DeploymentListResponse:
      type: object
      properties:
        page:
          type: integer
        has_next:
          type: boolean
        results:
          type: array
          items:
            $ref: '#/components/schemas/DeploymentListItem'
      required:
      - has_next
      - page
      - results
    DeploymentQuestionItem:
      type: object
      properties:
        question_id:
          type: integer
        number:
          type: integer
        type:
          $ref: '#/components/schemas/DeploymentQuestionItemTypeEnum'
        question:
          type: string
        point:
          type: integer
        prompt:
          type: string
          nullable: true
        blank_count:
          type: integer
          nullable: true
        options:
          type: array
          items:
            type: string
          nullable: true
        answer_input:
          type: string
      required:
      - answer_input
      - blank_count
      - number
      - options
      - point
      - prompt
      - question
      - question_id
      - type
    DeploymentQuestionItemTypeEnum:
      enum:
      - single_choice
      - multiple_choice
      - ox
      - short_answer
      - ordering
      - fill_blank
      type: string
      description: |-
        * `single_choice` - single_choice
        * `multiple_choice` - multiple_choice
        * `ox` - ox
        * `short_answer` - short_answer
        * `ordering` - ordering
        * `fill_blank` - fill_blank
    DeploymentStatusResponse:
      type: object
      properties:
        exam_status:
          type: string
        force_submit:
          type: boolean
      required:
      - exam_status
      - force_submit
    DeploymentSubject:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        thumbnail_img_url:
          type: string
          nullable: true
      required:
      - id
      - thumbnail_img_url
      - title
    EmailSendRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          minLength: 1
      required:
      - email
    EmailVerifyRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          minLength: 1
        code:
          type: string
          minLength: 6
          maxLength: 6
      required:
      - code
      - email
    EnrollStudentRequest:
      type: object
      properties:
        cohort_id:
          type: integer
      required:
      - cohort_id
    EnrollmentCohort:
      type: object
      description: 수강생 등록 요청한 기수 데이터
      properties:
        id:
          type: integer
          readOnly: true
        number:
          type: integer
          maximum: 32767
          minimum: -32768
      required:
      - id
      - number
    EnrollmentCourse:
      type: object
      description: 수강생 등록 요청한 강의 데이터
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 30
        tag:
          type: string
          maxLength: 3
      required:
      - id
      - name
      - tag
    EnrollmentUser:
      type: object
      description: 수강생 등록 요청한 유저 데이터
      properties:
        id:
          type: integer
          readOnly: true
        email:
          type: string
          format: email
          title: 이메일
          maxLength: 255
        name:
          type: string
          title: 이름
          maxLength: 30
        birthday:
          type: string
          format: date
          title: 생년월일
        gender:
          allOf:
          - $ref: '#/components/schemas/GenderE07Enum'
          title: 성별
      required:
      - birthday
      - email
      - gender
      - id
      - name
    ErrorDetail:
      type: object
      properties:
        error_detail:
          type: string
      required:
      - error_detail
    ErrorDetailField:
      type: object
      properties:
        error_detail:
          type: object
          additionalProperties:
            type: array
            items:
              type: string
      required:
      - error_detail
    ErrorDetailString:
      type: object
      properties:
        error_detail:
          type: string
      required:
      - error_detail
    ErrorResponse:
      type: object
      properties:
        error_detail:
          type: string
      required:
      - error_detail
    ExamCreateUpdate:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 50
        subject_id:
          type: integer
        thumbnail_img_url:
          type: string
          readOnly: true
      required:
      - id
      - subject_id
      - thumbnail_img_url
      - title
    ExamCreateUpdateRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 50
        subject_id:
          type: integer
        thumbnail_img:
          type: string
          writeOnly: true
          minLength: 1
      required:
      - subject_id
      - thumbnail_img
      - title
    ExamDeploymentCreateRequest:
      type: object
      properties:
        exam_id:
          type: integer
          minimum: 1
          writeOnly: true
        cohort_id:
          type: integer
          minimum: 1
          writeOnly: true
        duration_time:
          type: integer
          maximum: 32767
          minimum: 1
        open_at:
          type: string
          format: date-time
        close_at:
          type: string
          format: date-time
      required:
      - close_at
      - cohort_id
      - duration_time
      - exam_id
      - open_at
    ExamDeploymentCreateResponse:
      type: object
      properties:
        pk:
          type: integer
      required:
      - pk
    ExamDeploymentDeleteResponse:
      type: object
      properties:
        deployment_id:
          type: integer
      required:
      - deployment_id
    ExamDeploymentDetail:
      type: object
      properties:
        id:
          type: integer
        exam_access_url:
          type: string
        access_code:
          type: string
        cohort:
          $ref: '#/components/schemas/CohortSimple'
        submit_count:
          type: integer
        not_submitted_count:
          type: integer
        duration_time:
          type: integer
        open_at:
          type: string
        close_at:
          type: string
        created_at:
          type: string
        exam:
          $ref: '#/components/schemas/ExamSimple'
        subject:
          $ref: '#/components/schemas/SubjectSimple'
      required:
      - access_code
      - close_at
      - cohort
      - created_at
      - duration_time
      - exam
      - exam_access_url
      - id
      - not_submitted_count
      - open_at
      - subject
      - submit_count
    ExamDeploymentItem:
      type: object
      properties:
        exam_title:
          type: string
          readOnly: true
        subject_name:
          type: string
          readOnly: true
        duration_time:
          type: integer
          maximum: 32767
          minimum: -32768
        open_at:
          type: string
          format: date-time
        close_at:
          type: string
          format: date-time
      required:
      - close_at
      - exam_title
      - open_at
      - subject_name
    ExamDeploymentListItem:
      type: object
      properties:
        id:
          type: integer
        submit_count:
          type: integer
        avg_score:
          type: number
          format: double
        status:
          type: string
        exam:
          $ref: '#/components/schemas/ExamSimple'
        subject:
          $ref: '#/components/schemas/SubjectSimple'
        cohort:
          $ref: '#/components/schemas/CohortSimple'
        created_at:
          type: string
      required:
      - avg_score
      - cohort
      - created_at
      - exam
      - id
      - status
      - subject
      - submit_count
    ExamDeploymentListResponse:
      type: object
      properties:
        count:
          type: integer
        previous:
          type: string
          nullable: true
        next:
          type: string
          nullable: true
        results:
          type: array
          items:
            $ref: '#/components/schemas/ExamDeploymentListItem'
      required:
      - count
      - results
    ExamDeploymentStatusUpdateResponse:
      type: object
      properties:
        deployment_id:
          type: integer
        status:
          type: string
      required:
      - deployment_id
      - status
    ExamDeploymentUpdateResponse:
      type: object
      properties:
        deployment_id:
          type: integer
        duration_time:
          type: integer
        open_at:
          type: string
        close_at:
          type: string
        updated_at:
          type: string
      required:
      - close_at
      - deployment_id
      - duration_time
      - open_at
      - updated_at
    ExamDetail:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 50
        subject:
          allOf:
          - $ref: '#/components/schemas/ExamSubjectDetail'
          readOnly: true
        questions:
          type: array
          items:
            $ref: '#/components/schemas/ExamQuestionDetail'
        thumbnail_img_url:
          type: string
          maxLength: 255
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
      required:
      - created_at
      - id
      - questions
      - subject
      - title
      - updated_at
    ExamItem:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 50
        thumbnail_img_url:
          type: string
          maxLength: 255
      required:
      - id
      - title
    ExamList:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 50
        subject_name:
          type: string
          readOnly: true
        question_count:
          type: integer
          readOnly: true
        submit_count:
          type: integer
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
        updated_at:
          type: string
          format: date-time
          readOnly: true
        detail_url:
          type: string
          readOnly: true
      required:
      - created_at
      - detail_url
      - id
      - question_count
      - subject_name
      - submit_count
      - title
      - updated_at
    ExamQuestionCreateResponse:
      type: object
      properties:
        exam_id:
          type: integer
          readOnly: true
        type:
          $ref: '#/components/schemas/Type608Enum'
        question:
          type: string
          maxLength: 255
        prompt:
          type: string
          nullable: true
        options:
          readOnly: true
        blank_count:
          type: integer
          maximum: 32767
          minimum: -32768
          nullable: true
        correct_answer: {}
        point:
          type: integer
          maximum: 32767
          minimum: -32768
        explanation:
          type: string
      required:
      - correct_answer
      - exam_id
      - explanation
      - options
      - point
      - question
    ExamQuestionDeleteResponse:
      type: object
      properties:
        exam_id:
          type: integer
        question_id:
          type: integer
      required:
      - exam_id
      - question_id
    ExamQuestionDetail:
      type: object
      properties:
        question_id:
          type: integer
        type:
          $ref: '#/components/schemas/Type608Enum'
        question:
          type: string
          maxLength: 255
        prompt:
          type: string
          nullable: true
        point:
          type: integer
          maximum: 32767
          minimum: -32768
        options:
          readOnly: true
        correct_answer: {}
        explanation:
          type: string
      required:
      - correct_answer
      - explanation
      - options
      - point
      - question
      - question_id
    ExamQuestionRequest:
      type: object
      properties:
        type:
          $ref: '#/components/schemas/Type608Enum'
        question:
          type: string
          minLength: 1
          maxLength: 255
        prompt:
          type: string
          nullable: true
        options:
          type: array
          items:
            type: string
            minLength: 1
          nullable: true
        blank_count:
          type: integer
          minimum: 0
          nullable: true
        correct_answer: {}
        point:
          type: integer
          maximum: 10
          minimum: 0
        explanation:
          type: string
          minLength: 1
      required:
      - correct_answer
      - explanation
      - point
      - question
      - type
    ExamQuestionUpdateResponse:
      type: object
      properties:
        question_id:
          type: integer
        type:
          $ref: '#/components/schemas/Type608Enum'
        question:
          type: string
          maxLength: 255
        prompt:
          type: string
          nullable: true
        options:
          readOnly: true
        blank_count:
          type: integer
          maximum: 32767
          minimum: -32768
          nullable: true
        correct_answer: {}
        point:
          type: integer
          maximum: 32767
          minimum: -32768
        explanation:
          type: string
      required:
      - correct_answer
      - explanation
      - options
      - point
      - question
      - question_id
    ExamSimple:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        thumbnail_img_url:
          type: string
      required:
      - id
      - thumbnail_img_url
      - title
    ExamSubjectDetail:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 30
      required:
      - id
      - title
    ExamSubmissionCreateRequest:
      type: object
      properties:
        deployment_id:
          type: integer
        started_at:
          type: string
          format: date-time
        cheating_count:
          type: integer
          default: 0
        answers:
          type: array
          items:
            $ref: '#/components/schemas/AnswerItemRequest'
      required:
      - answers
      - deployment_id
      - started_at
    ExamSubmissionCreateResponse:
      type: object
      properties:
        submission_id:
          type: integer
          readOnly: true
        score:
          type: integer
          maximum: 32767
          minimum: -32768
        correct_answer_count:
          type: integer
          maximum: 32767
          minimum: -32768
        redirect_url:
          type: string
          readOnly: true
      required:
      - correct_answer_count
      - redirect_url
      - score
      - submission_id
    ExamSubmissionDetail:
      type: object
      properties:
        exam:
          allOf:
          - $ref: '#/components/schemas/ExamDeploymentItem'
          readOnly: true
        student:
          type: object
          additionalProperties: {}
          readOnly: true
        result:
          type: object
          additionalProperties: {}
          readOnly: true
        questions:
          type: array
          items:
            type: object
            additionalProperties: {}
          readOnly: true
      required:
      - exam
      - questions
      - result
      - student
    ExamSubmissionList:
      type: object
      properties:
        submission_id:
          type: integer
          readOnly: true
        nickname:
          type: string
          readOnly: true
        name:
          type: string
          readOnly: true
        course_name:
          type: string
          readOnly: true
        cohort_number:
          type: integer
          readOnly: true
        exam_title:
          type: string
          readOnly: true
        subject_name:
          type: string
          readOnly: true
        score:
          type: integer
          maximum: 32767
          minimum: -32768
        cheating_count:
          type: integer
          maximum: 32767
          minimum: -32768
        started_at:
          type: string
          format: date-time
        finished_at:
          type: string
          format: date-time
          readOnly: true
      required:
      - cheating_count
      - cohort_number
      - course_name
      - exam_title
      - finished_at
      - name
      - nickname
      - score
      - started_at
      - subject_name
      - submission_id
    ExamSubmissionResult:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        submitter_id:
          type: integer
          readOnly: true
        deployment_id:
          type: integer
          readOnly: true
        exam:
          allOf:
          - $ref: '#/components/schemas/ExamItem'
          readOnly: true
        questions:
          type: array
          items:
            type: object
            additionalProperties: {}
          readOnly: true
        cheating_count:
          type: integer
          maximum: 32767
          minimum: -32768
        total_score:
          type: integer
          readOnly: true
        score:
          type: integer
          readOnly: true
        correct_answer_count:
          type: integer
          maximum: 32767
          minimum: -32768
        elapsed_time:
          type: integer
          readOnly: true
        started_at:
          type: string
          format: date-time
        submitted_at:
          type: string
          format: date-time
          readOnly: true
      required:
      - cheating_count
      - correct_answer_count
      - deployment_id
      - elapsed_time
      - exam
      - id
      - questions
      - score
      - started_at
      - submitted_at
      - submitter_id
      - total_score
    FindEmailRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
        phone_number:
          type: string
          minLength: 1
        code:
          type: string
          minLength: 6
          maxLength: 6
      required:
      - code
      - name
      - phone_number
    GenderE07Enum:
      enum:
      - M
      - F
      type: string
      description: |-
        * `M` - Male
        * `F` - Female
    InProgressCourse:
      type: object
      properties:
        cohort:
          $ref: '#/components/schemas/CohortSimple'
        course:
          $ref: '#/components/schemas/CourseSimple'
      required:
      - cohort
      - course
    IntervalEnum:
      enum:
      - monthly
      - yearly
      type: string
      description: |-
        * `monthly` - monthly
        * `yearly` - yearly
    LoginRequest:
      type: object
      properties:
        email:
          type: string
          format: email
          minLength: 1
        password:
          type: string
          writeOnly: true
          minLength: 1
      required:
      - email
      - password
    MyCourseSimple:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 30
        tag:
          type: string
          maxLength: 3
        thumbnail_img_url:
          type: string
          nullable: true
          maxLength: 255
      required:
      - id
      - name
      - tag
    MyEnrolledCourse:
      type: object
      properties:
        cohort:
          $ref: '#/components/schemas/CohortSimple'
        course:
          $ref: '#/components/schemas/MyCourseSimple'
      required:
      - cohort
      - course
    NicknameCheckRequest:
      type: object
      properties:
        nickname:
          type: string
          minLength: 1
          maxLength: 10
      required:
      - nickname
    PaginatedAdminUserEnrollmentList:
      type: object
      required:
      - count
      - results
      properties:
        count:
          type: integer
          example: 123
        next:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=4
        previous:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=2
        results:
          type: array
          items:
            $ref: '#/components/schemas/AdminUserEnrollment'
    PaginatedAdminUserSearchListList:
      type: object
      required:
      - count
      - results
      properties:
        count:
          type: integer
          example: 123
        next:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=4
        previous:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=2
        results:
          type: array
          items:
            $ref: '#/components/schemas/AdminUserSearchList'
    PaginatedPostCommentList:
      type: object
      required:
      - count
      - results
      properties:
        count:
          type: integer
          example: 123
        next:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=4
        previous:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=2
        results:
          type: array
          items:
            $ref: '#/components/schemas/PostComment'
    PaginatedStudentManagerList:
      type: object
      required:
      - count
      - results
      properties:
        count:
          type: integer
          example: 123
        next:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=4
        previous:
          type: string
          nullable: true
          format: uri
          example: http://api.example.org/accounts/?page=2
        results:
          type: array
          items:
            $ref: '#/components/schemas/StudentManager'
    PasswordChangeRequest:
      type: object
      properties:
        old_password:
          type: string
          writeOnly: true
          minLength: 1
        new_password:
          type: string
          writeOnly: true
          minLength: 1
      required:
      - new_password
      - old_password
    PasswordFindRequest:
      type: object
      properties:
        email_token:
          type: string
          minLength: 1
        new_password:
          type: string
          minLength: 1
      required:
      - email_token
      - new_password
    PatchedAdminUserRoleUpdateRequest:
      type: object
      properties:
        role:
          $ref: '#/components/schemas/RoleF6eEnum'
        cohort_id:
          type: integer
          nullable: true
        assigned_courses:
          type: array
          items:
            type: integer
          default: []
    PatchedCohortUpdateRequestRequest:
      type: object
      properties:
        number:
          type: integer
        max_student:
          type: integer
        start_date:
          type: string
          format: date
        end_date:
          type: string
          format: date
        status:
          $ref: '#/components/schemas/Status24dEnum'
    PatchedCourseUpdateRequestRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 30
        tag:
          type: string
          minLength: 1
          maxLength: 3
        description:
          type: string
          maxLength: 255
        thumbnail_img_url:
          type: string
          maxLength: 255
    PatchedExamDeploymentStatusUpdateRequest:
      type: object
      properties:
        status:
          type: string
          minLength: 1
    PatchedExamDeploymentUpdateRequest:
      type: object
      properties:
        duration_time:
          type: integer
          maximum: 32767
          minimum: 1
        open_at:
          type: string
          format: date-time
        close_at:
          type: string
          format: date-time
    PatchedPhoneNumberChangeRequest:
      type: object
      properties:
        phone_verify_token:
          type: string
          minLength: 1
    PatchedProfileImageRequest:
      type: object
      properties:
        profile_img_url:
          type: string
          format: uri
          minLength: 1
    PatchedUserProfileUpdateRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          title: 이름
          maxLength: 30
        nickname:
          type: string
          minLength: 1
          title: 닉네임
          maxLength: 10
        gender:
          allOf:
          - $ref: '#/components/schemas/GenderE07Enum'
          title: 성별
        birthday:
          type: string
          format: date
          title: 생년월일
    PostCategoryListSpec:
      type: object
      description: |-
        카테고리 목록 조회 SPEC 응답용 serializer
        Fields:
            - id: 카테고리 ID
            - name: 카테고리 이름
        용도:
            - 게시글 카테고리 목록 조회에 사용
            - 목록 렌더링에 필요한 최소 필드만 전달
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          title: 카테고리 이름
          description: ex) 전체게시판, 공지사항, 자유게시판, 일상 공유, 개발 지식 공유, 취업 정보 공유, 프로젝트 구인
          maxLength: 20
      required:
      - id
      - name
    PostComment:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        post:
          type: integer
          readOnly: true
          title: 게시글id
        author:
          allOf:
          - $ref: '#/components/schemas/CommentAuthor'
          readOnly: true
        content:
          type: string
          maxLength: 300
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - author
      - content
      - created_at
      - id
      - post
      - updated_at
    PostCommentRequest:
      type: object
      properties:
        content:
          type: string
          minLength: 1
          maxLength: 300
      required:
      - content
    PostCommentUserSearch:
      type: object
      properties:
        id:
          type: integer
        nickname:
          type: string
        profile_img_url:
          type: string
          nullable: true
      required:
      - id
      - nickname
      - profile_img_url
    PostCreateRequest:
      type: object
      description: 게시글 저장 Serializer
      properties:
        title:
          type: string
          minLength: 1
          title: 게시글 제목
          maxLength: 50
        content:
          type: string
          minLength: 1
          title: 게시글 내용
        category_id:
          type: integer
      required:
      - category_id
      - content
      - title
    PostDetail:
      type: object
      description: 게시글 상세 조회용 Serializer
      properties:
        id:
          type: integer
        title:
          type: string
        author:
          $ref: '#/components/schemas/PostDetailAuthor'
        category_id:
          type: integer
        category_name:
          type: string
        content:
          type: string
        view_count:
          type: integer
        like_count:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
      required:
      - author
      - category_id
      - category_name
      - content
      - created_at
      - id
      - like_count
      - title
      - updated_at
      - view_count
    PostDetailAuthor:
      type: object
      description: 게시글 상세 작성자 Serializer
      properties:
        id:
          type: integer
        nickname:
          type: string
        profile_img_url:
          type: string
          nullable: true
      required:
      - id
      - nickname
      - profile_img_url
    PostDetailNotFound:
      type: object
      properties:
        error_detail:
          type: string
      required:
      - error_detail
    PostLikeResponse:
      type: object
      properties:
        detail:
          type: string
          readOnly: true
        post_id:
          type: integer
        is_liked:
          type: boolean
        like_count:
          type: integer
      required:
      - detail
      - is_liked
      - like_count
      - post_id
    PostList:
      type: object
      description: 게시글 목록 조회용 Serializer
      properties:
        id:
          type: integer
        author:
          $ref: '#/components/schemas/PostListAuthor'
        title:
          type: string
        thumbnail_img_url:
          type: string
          nullable: true
        content_preview:
          type: string
        comment_count:
          type: integer
        view_count:
          type: integer
        like_count:
          type: integer
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
        category_name:
          type: string
      required:
      - author
      - category_name
      - comment_count
      - content_preview
      - created_at
      - id
      - like_count
      - thumbnail_img_url
      - title
      - updated_at
      - view_count
    PostListAuthor:
      type: object
      description: 게시글 목록 작성자 Serializer
      properties:
        id:
          type: integer
        nickname:
          type: string
        profile_img_url:
          type: string
          nullable: true
      required:
      - id
      - nickname
      - profile_img_url
    PostUpdateRequest:
      type: object
      description: 게시글 수정 Serializer
      properties:
        title:
          type: string
          minLength: 1
          title: 게시글 제목
          maxLength: 50
        content:
          type: string
          minLength: 1
          title: 게시글 내용
        category_id:
          type: integer
      required:
      - category_id
      - content
      - title
    PresignedUrlRequestRequest:
      type: object
      properties:
        file_name:
          type: string
          minLength: 1
      required:
      - file_name
    ProfileImage:
      type: object
      properties:
        profile_img_url:
          type: string
          format: uri
      required:
      - profile_img_url
    QuestionCreateRequest:
      type: object
      properties:
        category_id:
          type: integer
          description: 카테고리_ID
        title:
          type: string
          minLength: 3
          maxLength: 100
        content:
          type: string
          minLength: 5
      required:
      - category_id
      - content
      - title
    QuestionCreateResponse:
      type: object
      properties:
        message:
          type: string
          default: 질문이 성공적으로 등록되었습니다.
        question_id:
          type: integer
      required:
      - question_id
    QuestionImages:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        img_url:
          type: string
          maxLength: 255
      required:
      - id
      - img_url
    QuestionList:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        category:
          allOf:
          - $ref: '#/components/schemas/Category'
          readOnly: true
        author:
          allOf:
          - $ref: '#/components/schemas/Author'
          readOnly: true
        title:
          type: string
          maxLength: 50
        content_preview:
          type: string
          readOnly: true
        answer_count:
          type: integer
          readOnly: true
          default: 0
        view_count:
          type: integer
          maximum: 2147483647
          minimum: -2147483648
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
        thumbnail_img_url:
          type: string
          nullable: true
          readOnly: true
      required:
      - answer_count
      - author
      - category
      - content_preview
      - created_at
      - id
      - thumbnail_img_url
      - title
      - updated_at
    QuestionListDetail:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 50
        content:
          type: string
        category:
          allOf:
          - $ref: '#/components/schemas/Category'
          readOnly: true
        images:
          type: array
          items:
            $ref: '#/components/schemas/QuestionImages'
          readOnly: true
        view_count:
          type: integer
          maximum: 2147483647
          minimum: -2147483648
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
        author:
          allOf:
          - $ref: '#/components/schemas/Author'
          readOnly: true
        answers:
          type: array
          items:
            $ref: '#/components/schemas/AnswerResponse'
          readOnly: true
      required:
      - answers
      - author
      - category
      - content
      - created_at
      - id
      - images
      - title
      - updated_at
    QuestionUpdateRequest:
      type: object
      properties:
        category_id:
          type: integer
        title:
          type: string
          minLength: 3
          maxLength: 100
        content:
          type: string
          minLength: 5
    QuestionUpdateResponse:
      type: object
      properties:
        question_id:
          type: integer
        updated_at:
          type: string
          format: date-time
      required:
      - question_id
      - updated_at
    RoleF6eEnum:
      enum:
      - USER
      - STUDENT
      - TA
      - OM
      - LC
      - ADMIN
      type: string
      description: |-
        * `USER` - User
        * `STUDENT` - Student
        * `TA` - Ta
        * `OM` - Om
        * `LC` - Lc
        * `ADMIN` - Admin
    SignUp:
      type: object
      properties:
        nickname:
          type: string
        name:
          type: string
        birthday:
          type: string
          format: date
        gender:
          $ref: '#/components/schemas/SignUpGenderEnum'
      required:
      - birthday
      - gender
      - name
      - nickname
    SignUpGenderEnum:
      enum:
      - M
      - F
      type: string
      description: |-
        * `M` - M
        * `F` - F
    SignUpRequest:
      type: object
      properties:
        password:
          type: string
          writeOnly: true
          minLength: 1
        nickname:
          type: string
          minLength: 1
        name:
          type: string
          minLength: 1
        birthday:
          type: string
          format: date
        gender:
          $ref: '#/components/schemas/SignUpGenderEnum'
        email_token:
          type: string
          writeOnly: true
          minLength: 1
        sms_token:
          type: string
          writeOnly: true
          minLength: 1
      required:
      - birthday
      - email_token
      - gender
      - name
      - nickname
      - password
      - sms_token
    SmsSendRequest:
      type: object
      properties:
        phone_number:
          type: string
          minLength: 1
          pattern: ^010-?\d{4}-?\d{4}$
      required:
      - phone_number
    SmsVerifyRequest:
      type: object
      properties:
        phone_number:
          type: string
          minLength: 1
          pattern: ^010-?\d{4}-?\d{4}$
        code:
          type: string
          minLength: 6
          maxLength: 6
      required:
      - code
      - phone_number
    Status24dEnum:
      enum:
      - PREPARING
      - IN_PROGRESS
      - FINISHED
      type: string
      description: |-
        * `PREPARING` - Preparing
        * `IN_PROGRESS` - In Progress
        * `FINISHED` - Finished
    Status920Enum:
      enum:
      - ACTIVATED
      - DEACTIVATED
      - WITHDREW
      type: string
      description: |-
        * `ACTIVATED` - Activated
        * `DEACTIVATED` - Deactivated
        * `WITHDREW` - Withdrew
    StudentEnrollmentTrendItem:
      type: object
      properties:
        period:
          type: string
        count:
          type: integer
      required:
      - count
      - period
    StudentEnrollmentTrendResponse:
      type: object
      properties:
        interval:
          $ref: '#/components/schemas/IntervalEnum'
        from_date:
          type: string
          format: date
        to_date:
          type: string
          format: date
        total:
          type: integer
        items:
          type: array
          items:
            $ref: '#/components/schemas/StudentEnrollmentTrendItem'
      required:
      - from_date
      - interval
      - items
      - to_date
      - total
    StudentManager:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        email:
          type: string
          format: email
          title: 이메일
          maxLength: 255
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        name:
          type: string
          title: 이름
          maxLength: 30
        phone_number:
          type: string
          title: 휴대폰번호
          maxLength: 20
        birthday:
          type: string
          format: date
          title: 생년월일
        status:
          $ref: '#/components/schemas/Status920Enum'
        role:
          allOf:
          - $ref: '#/components/schemas/RoleF6eEnum'
          title: 권한
        in_progress_course:
          allOf:
          - $ref: '#/components/schemas/InProgressCourse'
          nullable: true
          readOnly: true
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
      required:
      - birthday
      - created_at
      - email
      - id
      - in_progress_course
      - name
      - nickname
      - phone_number
    StudentSubjectScoreItem:
      type: object
      properties:
        subject:
          type: string
        score:
          type: integer
      required:
      - score
      - subject
    SubjectCreateRequestRequest:
      type: object
      properties:
        course_id:
          type: integer
        title:
          type: string
          minLength: 1
          maxLength: 30
        number_of_days:
          type: integer
          minimum: 1
        number_of_hours:
          type: integer
          minimum: 1
        thumbnail_img_url:
          type: string
          nullable: true
          maxLength: 255
      required:
      - course_id
      - number_of_days
      - number_of_hours
      - title
    SubjectCreateResponse:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        course_id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 30
        number_of_days:
          type: integer
          maximum: 32767
          minimum: -32768
        number_of_hours:
          type: integer
          maximum: 32767
          minimum: -32768
        thumbnail_img_url:
          type: string
          nullable: true
          maxLength: 255
        status:
          type: string
          readOnly: true
      required:
      - course_id
      - id
      - number_of_days
      - number_of_hours
      - status
      - title
    SubjectListItem:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        course_id:
          type: integer
          readOnly: true
        title:
          type: string
          maxLength: 30
        status:
          type: string
          readOnly: true
        thumbnail_img_url:
          type: string
          nullable: true
          maxLength: 255
      required:
      - course_id
      - id
      - status
      - title
    SubjectScatterPoint:
      type: object
      properties:
        time:
          type: number
          format: double
          readOnly: true
        score:
          type: integer
          maximum: 32767
          minimum: -32768
      required:
      - score
      - time
    SubjectSimple:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
      required:
      - id
      - name
    Type608Enum:
      enum:
      - SINGLE_CHOICE
      - MULTIPLE_CHOICE
      - OX
      - SHORT_ANSWER
      - ORDERING
      - FILL_BLANK
      type: string
      description: |-
        * `SINGLE_CHOICE` - Single Choice
        * `MULTIPLE_CHOICE` - Multiple Choice
        * `OX` - Ox
        * `SHORT_ANSWER` - Short Answer
        * `ORDERING` - Ordering
        * `FILL_BLANK` - Fill Blank
    UserCategory:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        name:
          type: string
          maxLength: 15
        category_type:
          type: string
          readOnly: true
        children:
          readOnly: true
      required:
      - category_type
      - children
      - id
      - name
    UserProfile:
      type: object
      properties:
        id:
          type: integer
          readOnly: true
        email:
          type: string
          format: email
          readOnly: true
          title: 이메일
        name:
          type: string
          title: 이름
          maxLength: 30
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        phone_number:
          type: string
          readOnly: true
          title: 휴대폰번호
        gender:
          allOf:
          - $ref: '#/components/schemas/GenderE07Enum'
          title: 성별
        birthday:
          type: string
          format: date
          title: 생년월일
        profile_img_url:
          type: string
          nullable: true
          maxLength: 255
        role:
          allOf:
          - $ref: '#/components/schemas/RoleF6eEnum'
          readOnly: true
          title: 권한
        created_at:
          type: string
          format: date-time
          readOnly: true
          title: 생성일
        updated_at:
          type: string
          format: date-time
          readOnly: true
          title: 수정일
      required:
      - birthday
      - created_at
      - email
      - gender
      - id
      - name
      - nickname
      - phone_number
      - role
      - updated_at
    UserProfileUpdate:
      type: object
      properties:
        name:
          type: string
          title: 이름
          maxLength: 30
        nickname:
          type: string
          title: 닉네임
          maxLength: 10
        gender:
          allOf:
          - $ref: '#/components/schemas/GenderE07Enum'
          title: 성별
        birthday:
          type: string
          format: date
          title: 생년월일
      required:
      - birthday
      - gender
      - name
      - nickname
    UsingModelEnum:
      enum:
      - gemini-2.0-flash
      - gemini-2.5-flash
      - gemini-2.5-flash-lite
      type: string
      description: |-
        * `gemini-2.0-flash` - Gemini 2.0 Flash
        * `gemini-2.5-flash` - Gemini 2.5 Flash
        * `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite
    WithdrawalMonthlyReasonItem:
      type: object
      properties:
        period:
          type: string
        count:
          type: integer
      required:
      - count
      - period
    WithdrawalMonthlyReasonStats:
      type: object
      properties:
        reason:
          type: string
        reason_label:
          type: string
        from_date:
          type: string
          format: date
        to_date:
          type: string
          format: date
        total:
          type: integer
        items:
          type: array
          items:
            $ref: '#/components/schemas/WithdrawalMonthlyReasonItem'
      required:
      - from_date
      - items
      - reason
      - reason_label
      - to_date
      - total
    WithdrawalReasonCount:
      type: object
      properties:
        from_date:
          type: string
          format: date
        to_date:
          type: string
          format: date
        total:
          type: integer
        items:
          type: array
          items:
            $ref: '#/components/schemas/WithdrawalReasonCountItem'
      required:
      - from_date
      - items
      - to_date
      - total
    WithdrawalReasonCountItem:
      type: object
      properties:
        reason:
          type: string
        reason_label:
          type: string
        count:
          type: integer
        percentage:
          type: number
          format: double
      required:
      - count
      - percentage
      - reason
      - reason_label
  securitySchemes:
    jwtAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
