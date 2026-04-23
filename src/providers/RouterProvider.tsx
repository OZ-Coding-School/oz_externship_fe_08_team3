import { Routes, Route } from 'react-router'
import { DefaultLayout } from '@/components'
import {
  QnaListPage,
  QnaWritePage,
  QnaDetailPage,
  QnaEditPage,
} from '@/pages/qna'

import { ComponentShowcase } from '@/pages/ComponentShowcase'

export function RouterProvider() {
  return (
    <Routes>
      {/* Header + Footer */}
      <Route element={<DefaultLayout />}>
        <Route path="qna">
          <Route index element={<QnaListPage />} />
          <Route path="write" element={<QnaWritePage />} />
          <Route path=":questionId">
            <Route index element={<QnaDetailPage />} />
            <Route path="edit" element={<QnaEditPage />} />
          </Route>
        </Route>

        <Route path="showcase" element={<ComponentShowcase />} />
      </Route>
    </Routes>
  )
}
