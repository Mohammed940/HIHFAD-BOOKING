-- Seed sample data for the medical appointment system

-- Insert sample medical centers
INSERT INTO public.medical_centers (id, name, description, address, phone, email, working_hours) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'مستشفى الملك فهد الطبي',
  'مستشفى متخصص في جميع التخصصات الطبية مع أحدث التقنيات والمعدات الطبية',
  'الرياض، حي الملز، شارع الملك فهد',
  '+966112345678',
  'info@kfmc.sa',
  '{"saturday": {"start": "08:00", "end": "22:00"}, "sunday": {"start": "08:00", "end": "22:00"}, "monday": {"start": "08:00", "end": "22:00"}, "tuesday": {"start": "08:00", "end": "22:00"}, "wednesday": {"start": "08:00", "end": "22:00"}, "thursday": {"start": "08:00", "end": "22:00"}, "friday": {"closed": true}}'
),
(
  '22222222-2222-2222-2222-222222222222',
  'مجمع الدمام الطبي',
  'مجمع طبي شامل يقدم خدمات طبية متميزة في المنطقة الشرقية',
  'الدمام، حي الفيصلية، طريق الملك عبدالعزيز',
  '+966138765432',
  'contact@dammam-medical.sa',
  '{"saturday": {"start": "07:00", "end": "23:00"}, "sunday": {"start": "07:00", "end": "23:00"}, "monday": {"start": "07:00", "end": "23:00"}, "tuesday": {"start": "07:00", "end": "23:00"}, "wednesday": {"start": "07:00", "end": "23:00"}, "thursday": {"start": "07:00", "end": "23:00"}, "friday": {"start": "14:00", "end": "23:00"}}'
),
(
  '33333333-3333-3333-3333-333333333333',
  'مستشفى جدة الأهلي',
  'مستشفى أهلي رائد في تقديم الرعاية الصحية المتطورة',
  'جدة، حي الزهراء، شارع فلسطين',
  '+966126543210',
  'info@jeddah-national.sa',
  '{"saturday": {"start": "06:00", "end": "24:00"}, "sunday": {"start": "06:00", "end": "24:00"}, "monday": {"start": "06:00", "end": "24:00"}, "tuesday": {"start": "06:00", "end": "24:00"}, "wednesday": {"start": "06:00", "end": "24:00"}, "thursday": {"start": "06:00", "end": "24:00"}, "friday": {"start": "06:00", "end": "24:00"}}'
);

-- Insert sample clinics
INSERT INTO public.clinics (id, medical_center_id, name, description, doctor_name, working_hours) VALUES
-- King Fahd Medical Center Clinics
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'عيادة القلب والأوعية الدموية',
  'تشخيص وعلاج أمراض القلب والشرايين',
  'د. أحمد محمد العلي',
  '{"saturday": {"start": "08:00", "end": "16:00"}, "sunday": {"start": "08:00", "end": "16:00"}, "monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}}'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'عيادة الأطفال',
  'رعاية صحية شاملة للأطفال من الولادة حتى 18 سنة',
  'د. فاطمة سالم الزهراني',
  '{"saturday": {"start": "09:00", "end": "17:00"}, "sunday": {"start": "09:00", "end": "17:00"}, "monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}}'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  'عيادة العظام والمفاصل',
  'تشخيص وعلاج إصابات وأمراض العظام والمفاصل',
  'د. خالد عبدالله الشمري',
  '{"saturday": {"start": "10:00", "end": "18:00"}, "sunday": {"start": "10:00", "end": "18:00"}, "monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}}'
),

-- Dammam Medical Complex Clinics
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  '22222222-2222-2222-2222-222222222222',
  'عيادة الجلدية والتجميل',
  'علاج الأمراض الجلدية والإجراءات التجميلية',
  'د. نورا حسن القحطاني',
  '{"saturday": {"start": "08:00", "end": "15:00"}, "sunday": {"start": "08:00", "end": "15:00"}, "monday": {"start": "08:00", "end": "15:00"}, "tuesday": {"start": "08:00", "end": "15:00"}, "wednesday": {"start": "08:00", "end": "15:00"}, "thursday": {"start": "08:00", "end": "15:00"}}'
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '22222222-2222-2222-2222-222222222222',
  'عيادة النساء والولادة',
  'رعاية صحية متخصصة للنساء والحوامل',
  'د. مريم علي الدوسري',
  '{"saturday": {"start": "07:00", "end": "19:00"}, "sunday": {"start": "07:00", "end": "19:00"}, "monday": {"start": "07:00", "end": "19:00"}, "tuesday": {"start": "07:00", "end": "19:00"}, "wednesday": {"start": "07:00", "end": "19:00"}, "thursday": {"start": "07:00", "end": "19:00"}}'
),

-- Jeddah National Hospital Clinics
(
  'ffffffff-ffff-ffff-ffff-ffffffffffff',
  '33333333-3333-3333-3333-333333333333',
  'عيادة الأنف والأذن والحنجرة',
  'تشخيص وعلاج أمراض الأنف والأذن والحنجرة',
  'د. سعد محمد الغامدي',
  '{"saturday": {"start": "09:00", "end": "17:00"}, "sunday": {"start": "09:00", "end": "17:00"}, "monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}}'
),
(
  'gggggggg-gggg-gggg-gggg-gggggggggggg',
  '33333333-3333-3333-3333-333333333333',
  'عيادة العيون',
  'فحص وعلاج أمراض العيون وجراحات الليزر',
  'د. عبدالرحمن يوسف الحربي',
  '{"saturday": {"start": "08:00", "end": "16:00"}, "sunday": {"start": "08:00", "end": "16:00"}, "monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}}'
);

-- Insert sample news
INSERT INTO public.news (title, content, summary, is_published, published_at, created_by) VALUES
(
  'افتتاح قسم جديد للطوارئ',
  'يسعدنا أن نعلن عن افتتاح قسم الطوارئ الجديد المجهز بأحدث التقنيات الطبية والمعدات المتطورة. يضم القسم 50 سريراً و10 غرف عمليات طوارئ مع فريق طبي متخصص متاح على مدار الساعة.',
  'افتتاح قسم طوارئ جديد مجهز بأحدث التقنيات',
  true,
  NOW() - INTERVAL '2 days',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'حملة فحص مجاني للسكري',
  'في إطار المسؤولية المجتمعية، ننظم حملة فحص مجاني لمرض السكري لجميع المواطنين والمقيمين. الحملة تشمل فحص السكر التراكمي وقياس الضغط والوزن مع استشارة طبية مجانية.',
  'حملة فحص مجاني للسكري متاحة لجميع المواطنين',
  true,
  NOW() - INTERVAL '5 days',
  (SELECT id FROM auth.users LIMIT 1)
),
(
  'تطبيق تقنيات الذكاء الاصطناعي في التشخيص',
  'نفخر بإعلان تطبيق أحدث تقنيات الذكاء الاصطناعي في عمليات التشخيص الطبي، مما يساعد على تحسين دقة التشخيص وسرعة العلاج للمرضى.',
  'تطبيق الذكاء الاصطناعي لتحسين دقة التشخيص',
  true,
  NOW() - INTERVAL '1 week',
  (SELECT id FROM auth.users LIMIT 1)
);
