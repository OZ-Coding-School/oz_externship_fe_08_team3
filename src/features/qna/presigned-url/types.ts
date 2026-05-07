export interface GetPresignedUrlRequest {
  file_name: string
}

export interface GetPresignedUrlResponse {
  presigned_url: string
  img_url: string
  key: string
}
