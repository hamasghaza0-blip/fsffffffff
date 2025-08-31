/*
  # إنشاء جدول القراء (reciters)

  1. جدول جديد
    - `reciters`
      - `id` (uuid, primary key)
      - `name` (text, اسم الطالب)
      - `category` (text, الفئة المسجل بها)
      - `teacher` (text, اسم المحفظ)
      - `created_at` (timestamp, تاريخ التسجيل)

  2. الأمان
    - تفعيل RLS على جدول `reciters`
    - إضافة سياسة للقراءة للجميع
*/

CREATE TABLE IF NOT EXISTS reciters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  category text DEFAULT '',
  teacher text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reciters ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح بالقراءة للجميع
CREATE POLICY "Allow public read access"
  ON reciters
  FOR SELECT
  TO public
  USING (true);

-- سياسة للسماح بالإدراج للمستخدمين المصرح لهم
CREATE POLICY "Allow authenticated insert"
  ON reciters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- إضافة فهرس للبحث السريع بالاسم
CREATE INDEX IF NOT EXISTS idx_reciters_name ON reciters(name);
CREATE INDEX IF NOT EXISTS idx_reciters_category ON reciters(category);
CREATE INDEX IF NOT EXISTS idx_reciters_teacher ON reciters(teacher);