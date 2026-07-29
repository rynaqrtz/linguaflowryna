import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY belum diatur di environment variable server." },
      { status: 500 },
    );
  }

  const requester = await createServerSupabase();
  const {
    data: { user: requesterUser },
  } = await requester.auth.getUser();

  if (!requesterUser || requesterUser.user_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Hanya admin yang bisa mengundang guru." }, { status: 403 });
  }

  let body: { email?: string; fullName?: string; classIds?: string[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const email = body.email?.trim();
  const fullName = body.fullName?.trim();
  if (!email || !fullName) {
    return NextResponse.json({ error: "Nama dan email wajib diisi." }, { status: 400 });
  }

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  const schoolId = requesterUser.user_metadata?.school_id;

  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      role: "guru",
      full_name: fullName,
      school_id: schoolId,
      class_ids: body.classIds ?? [],
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ userId: data.user.id });
}
