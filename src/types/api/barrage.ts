export type PostSendDanmakuData = {
  content: string
  font_color: string
}

export interface Barrage {
  user_id: number
  user_avatar: string | null
  user_name: string
  font_color: string
  content: string
  create_at: string
}

export interface WelcomeBarrage {
  openid: string
  nick_name: string
  username: string
  user_code: string
  create_at: string
  company_id: number
  dep_code: string
  membership_code: string
}
