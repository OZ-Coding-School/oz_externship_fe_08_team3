import { Routes, Route, Outlet } from 'react-router'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/auth'
import { SignupSelectPage, SignupPage } from '@/pages/signup'
import { MypagePage, MypageEditPage, ChangePasswordPage } from '@/pages/mypage'
import { QuizListPage, QuizExamPage, QuizResultPage } from '@/pages/quiz'
import {
  QnaListPage,
  QnaWritePage,
  QnaDetailPage,
  QnaEditPage,
} from '@/pages/qna'
import {
  CommunityListPage,
  CommunityWritePage,
  CommunityDetailPage,
  CommunityEditPage,
} from '@/pages/community'
import { ComponentShowcase } from '@/pages/ComponentShowcase'

export function RouterProvider() {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route index element={<HomePage />} />

        <Route path="login" element={<LoginPage />} />

        <Route path="signup">
          <Route index element={<SignupSelectPage />} />
          <Route path="form" element={<SignupPage />} />
        </Route>

        <Route path="mypage">
          <Route index element={<MypagePage />} />
          <Route path="edit" element={<MypageEditPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="quiz" element={<QuizListPage />} />
        </Route>

        <Route path="quiz/:quizId">
          <Route path="exam" element={<QuizExamPage />} />
          <Route path="result" element={<QuizResultPage />} />
        </Route>

        <Route path="qna">
          <Route index element={<QnaListPage />} />
          <Route path="write" element={<QnaWritePage />} />
          <Route path=":questionId">
            <Route index element={<QnaDetailPage />} />
            <Route path="edit" element={<QnaEditPage />} />
          </Route>
        </Route>

        <Route path="community">
          <Route index element={<CommunityListPage />} />
          <Route path="write" element={<CommunityWritePage />} />
          <Route path=":postId">
            <Route index element={<CommunityDetailPage />} />
            <Route path="edit" element={<CommunityEditPage />} />
          </Route>
        </Route>

        <Route path="showcase" element={<ComponentShowcase />} />
      </Route>
    </Routes>
  )
}
