create type user_role as enum ('admin', 'guru', 'murid');
create type jlpt_level as enum ('N5', 'N4', 'N3', 'N2', 'N1');
create type submission_status as enum ('pending', 'submitted', 'graded');
create type chat_role as enum ('user', 'assistant');

create table schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  npsn text,
  created_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  level text not null,
  major text not null,
  homeroom_teacher_id uuid,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  school_id uuid references schools(id) on delete set null,
  class_id uuid references classes(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table classes
  add constraint classes_homeroom_teacher_fk
  foreign key (homeroom_teacher_id) references profiles(id) on delete set null;

create table words (
  id uuid primary key default gen_random_uuid(),
  kanji text not null,
  furigana text not null,
  romaji text not null,
  arti text not null,
  level jlpt_level not null,
  contoh text,
  contoh_id text,
  word_group text,
  created_at timestamptz not null default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  teacher_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  created_at timestamptz not null default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status submission_status not null default 'pending',
  score integer,
  feedback text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (task_id, student_id)
);

create table quizzes (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  teacher_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  word_id uuid references words(id) on delete set null,
  question text not null,
  options jsonb not null,
  correct_option text not null,
  position integer not null default 0
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  score integer not null,
  completed_at timestamptz not null default now(),
  unique (quiz_id, student_id)
);

create table progress (
  student_id uuid primary key references profiles(id) on delete cascade,
  xp integer not null default 0,
  streak integer not null default 0,
  last_study_date date
);

create table srs_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  word_id uuid not null references words(id) on delete cascade,
  due_date date not null,
  review_count integer not null default 0,
  mastered boolean not null default false,
  unique (student_id, word_id)
);

create index srs_items_due_idx on srs_items (student_id, due_date);

create table ai_sensei_messages (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  role chat_role not null,
  content text not null,
  created_at timestamptz not null default now()
);

create index ai_sensei_messages_student_idx on ai_sensei_messages (student_id, created_at);

create table speech_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles(id) on delete cascade,
  target_sentence text not null,
  transcript text,
  accuracy_score integer,
  confidence_score integer,
  overall_score integer,
  created_at timestamptz not null default now()
);

create index tasks_class_idx on tasks (class_id);
create index submissions_task_idx on submissions (task_id);
create index submissions_student_idx on submissions (student_id);
create index classes_school_idx on classes (school_id);
create index profiles_school_idx on profiles (school_id);
create index profiles_class_idx on profiles (class_id);

create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'murid'),
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Pengguna Baru')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create function current_role_is(target_role user_role)
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = target_role
  );
$$;

create function current_class_id()
returns uuid
language sql
security definer set search_path = public
stable
as $$
  select class_id from profiles where id = auth.uid();
$$;

create function current_school_id()
returns uuid
language sql
security definer set search_path = public
stable
as $$
  select school_id from profiles where id = auth.uid();
$$;

alter table schools enable row level security;
alter table classes enable row level security;
alter table profiles enable row level security;
alter table words enable row level security;
alter table tasks enable row level security;
alter table submissions enable row level security;
alter table quizzes enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table progress enable row level security;
alter table srs_items enable row level security;
alter table ai_sensei_messages enable row level security;
alter table speech_attempts enable row level security;

create policy profiles_select_own on profiles
  for select using (id = auth.uid());

create policy profiles_select_same_school on profiles
  for select using (school_id = current_school_id());

create policy profiles_update_own on profiles
  for update using (id = auth.uid());

create policy schools_select_own on schools
  for select using (id = current_school_id());

create policy classes_select_same_school on classes
  for select using (school_id = current_school_id());

create policy words_select_all on words
  for select using (true);

create policy tasks_select_own_class on tasks
  for select using (class_id = current_class_id() or teacher_id = auth.uid());

create policy tasks_insert_teacher on tasks
  for insert with check (teacher_id = auth.uid() and current_role_is('guru'));

create policy tasks_update_teacher on tasks
  for update using (teacher_id = auth.uid());

create policy submissions_select_own_or_teacher on submissions
  for select using (
    student_id = auth.uid()
    or exists (select 1 from tasks where tasks.id = submissions.task_id and tasks.teacher_id = auth.uid())
  );

create policy submissions_insert_own on submissions
  for insert with check (student_id = auth.uid());

create policy submissions_update_own_or_teacher on submissions
  for update using (
    student_id = auth.uid()
    or exists (select 1 from tasks where tasks.id = submissions.task_id and tasks.teacher_id = auth.uid())
  );

create policy quizzes_select_own_class on quizzes
  for select using (class_id = current_class_id() or teacher_id = auth.uid());

create policy quizzes_insert_teacher on quizzes
  for insert with check (teacher_id = auth.uid() and current_role_is('guru'));

create policy quiz_questions_select_via_quiz on quiz_questions
  for select using (
    exists (
      select 1 from quizzes
      where quizzes.id = quiz_questions.quiz_id
      and (quizzes.class_id = current_class_id() or quizzes.teacher_id = auth.uid())
    )
  );

create policy quiz_attempts_select_own_or_teacher on quiz_attempts
  for select using (
    student_id = auth.uid()
    or exists (select 1 from quizzes where quizzes.id = quiz_attempts.quiz_id and quizzes.teacher_id = auth.uid())
  );

create policy quiz_attempts_insert_own on quiz_attempts
  for insert with check (student_id = auth.uid());

create policy progress_select_own on progress
  for select using (student_id = auth.uid());

create policy progress_select_teacher on progress
  for select using (
    exists (
      select 1 from profiles p
      where p.id = progress.student_id and p.class_id = current_class_id() and current_role_is('guru')
    )
  );

create policy progress_upsert_own on progress
  for insert with check (student_id = auth.uid());

create policy progress_update_own on progress
  for update using (student_id = auth.uid());

create policy srs_items_select_own on srs_items
  for select using (student_id = auth.uid());

create policy srs_items_insert_own on srs_items
  for insert with check (student_id = auth.uid());

create policy srs_items_update_own on srs_items
  for update using (student_id = auth.uid());

create policy ai_sensei_messages_select_own on ai_sensei_messages
  for select using (student_id = auth.uid());

create policy ai_sensei_messages_insert_own on ai_sensei_messages
  for insert with check (student_id = auth.uid());

create policy speech_attempts_select_own on speech_attempts
  for select using (student_id = auth.uid());

create policy speech_attempts_insert_own on speech_attempts
  for insert with check (student_id = auth.uid());
