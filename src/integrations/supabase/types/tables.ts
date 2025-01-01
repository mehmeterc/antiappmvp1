export interface BookingHistoryTable {
  Row: {
    cafe_id: string;
    cafe_name: string;
    check_in_time: string;
    check_out_time: string | null;
    created_at: string | null;
    id: string;
    status: string;
    total_cost: number | null;
    user_id: string;
  };
  Insert: {
    cafe_id: string;
    cafe_name: string;
    check_in_time: string;
    check_out_time?: string | null;
    created_at?: string | null;
    id?: string;
    status: string;
    total_cost?: number | null;
    user_id: string;
  };
  Update: {
    cafe_id?: string;
    cafe_name?: string;
    check_in_time?: string;
    check_out_time?: string | null;
    created_at?: string | null;
    id?: string;
    status?: string;
    total_cost?: number | null;
    user_id?: string;
  };
}

export interface MessagesTable {
  Row: {
    cafe_id: string | null;
    content: string;
    created_at: string | null;
    id: string;
    receiver_id: string;
    sender_id: string;
  };
  Insert: {
    cafe_id?: string | null;
    content: string;
    created_at?: string | null;
    id?: string;
    receiver_id: string;
    sender_id: string;
  };
  Update: {
    cafe_id?: string | null;
    content?: string;
    created_at?: string | null;
    id?: string;
    receiver_id?: string;
    sender_id?: string;
  };
}

export interface ProfilesTable {
  Row: {
    avatar_url: string | null;
    email: string | null;
    full_name: string | null;
    id: string;
    payment_method: string | null;
    updated_at: string | null;
  };
  Insert: {
    avatar_url?: string | null;
    email?: string | null;
    full_name?: string | null;
    id: string;
    payment_method?: string | null;
    updated_at?: string | null;
  };
  Update: {
    avatar_url?: string | null;
    email?: string | null;
    full_name?: string | null;
    id?: string;
    payment_method?: string | null;
    updated_at?: string | null;
  };
}

export interface ReviewsTable {
  Row: {
    cafe_id: string;
    comment: string | null;
    created_at: string | null;
    id: string;
    rating: number;
    user_id: string;
  };
  Insert: {
    cafe_id: string;
    comment?: string | null;
    created_at?: string | null;
    id?: string;
    rating: number;
    user_id: string;
  };
  Update: {
    cafe_id?: string;
    comment?: string | null;
    created_at?: string | null;
    id?: string;
    rating?: number;
    user_id?: string;
  };
}

export interface SavedCafesTable {
  Row: {
    cafe_id: string;
    created_at: string | null;
    id: string;
    user_id: string;
  };
  Insert: {
    cafe_id: string;
    created_at?: string | null;
    id?: string;
    user_id: string;
  };
  Update: {
    cafe_id?: string;
    created_at?: string | null;
    id?: string;
    user_id?: string;
  };
}