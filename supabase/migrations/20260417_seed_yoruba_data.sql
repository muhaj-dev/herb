-- Seed data for previewing the Yoruba / disease-under-condition features.
-- Idempotent: re-running will update existing rows (matched by slug) instead of
-- duplicating. Safe to run after the yoruba_fields migration.

-- ─────────────────────────────────────────────────────────────
-- 1. Backfill Yoruba fields on any existing seed rows
-- ─────────────────────────────────────────────────────────────

update public.categories
set yoruba_name = coalesce(nullif(yoruba_name, ''), 'Ẹ̀ka')
where yoruba_name = '' or yoruba_name is null;

update public.conditions
set yoruba_name = case slug
      when 'digestive-health' then 'Ìlera Ìfun'
      when 'energy-vitality'  then 'Agbára àti Ìlera'
      when 'immune-defense'   then 'Ààbò Ara'
      when 'skin-health'      then 'Ìlera Awọ'
      when 'sleep-support'    then 'Ìrànlọ́wọ́ Oorun'
      when 'stress-anxiety'   then 'Ìdààmú Ọkàn'
      else coalesce(nullif(yoruba_name, ''), 'Ipò Ìlera')
    end,
    yoruba_description = case slug
      when 'digestive-health' then 'Ìfun tí ó ní ìlera ń mú kí ara lágbára.'
      when 'energy-vitality'  then 'Agbára àti ìdùnnú ara wa láti ọ̀dọ̀ oúnjẹ àti oògùn.'
      when 'immune-defense'   then 'Ààbò ara láti dènà àrùn.'
      when 'skin-health'      then 'Awọ tí ó mọ́ ń fi ìlera inú hàn.'
      when 'sleep-support'    then 'Oorun tí ó dára máa ń wo ara sàn.'
      when 'stress-anxiety'   then 'Ìfọ̀kànbalẹ̀ ọkàn ṣe pàtàkì fún ìlera gbogbo.'
      else coalesce(nullif(yoruba_description, ''), 'Ṣàlàyé ipò ìlera yìí.')
    end
where yoruba_name = '' or yoruba_name is null
   or yoruba_description = '' or yoruba_description is null;

-- Ensure a "General Health" fallback condition exists
insert into public.conditions (name, slug, description, yoruba_name, yoruba_description, icon)
values (
  'General Health',
  'general-health',
  'A catch-all category for wellness topics that do not fit elsewhere.',
  'Ìlera Gbogbogbò',
  'Ilé-ìkóhun àwọn ọ̀ràn ìlera gbogbogbò.',
  'favorite'
)
on conflict (slug) do update
set yoruba_name = excluded.yoruba_name,
    yoruba_description = excluded.yoruba_description;

-- ─────────────────────────────────────────────────────────────
-- 2. Insert 6 diseases (with Yoruba fields)
-- ─────────────────────────────────────────────────────────────

insert into public.diseases (name, slug, yoruba_name, yoruba_description, scientific_name, category, symptoms, description, icon, status, severity, severity_label, is_featured)
values
  ('Malaria', 'malaria',
    'Ibà',
    'Àrùn tí ẹ̀fọn ń gbé wá, ó máa ń fa gbígbóná ara àti ẹ̀fọ́rí. A lè wò ó pẹ̀lú ewé dogoyaro àti ewúro.',
    'Plasmodium falciparum',
    'infectious',
    array['High fever', 'Chills', 'Headache', 'Body aches', 'Sweating'],
    array['Malaria is a mosquito-borne infection that remains one of the most common illnesses in tropical regions.', 'Traditional Yoruba medicine treats malaria using bitter herbs like Dogoyaro (neem) and Ewúro (bitter leaf).'],
    'pest_control', 'Active', 4, 'High', true),

  ('Typhoid Fever', 'typhoid-fever',
    'Ibà Jẹ̀ jẹ̀',
    'Àrùn tí a máa ń kó látinú omi àti oúnjẹ aláìmọ́. Ó ń ba ìfun àti ẹ̀dọ̀ jẹ́.',
    'Salmonella typhi',
    'digestive',
    array['Prolonged fever', 'Stomach pain', 'Weakness', 'Loss of appetite', 'Rose-coloured spots'],
    array['Typhoid fever spreads through contaminated food and water and inflames the digestive tract.', 'Bitter leaf and scent leaf preparations are commonly used alongside proper hydration.'],
    'sick', 'Active', 4, 'High', false),

  ('Cough & Cold', 'cough-and-cold',
    'Ikọ́ àti Òtùtù',
    'Aṣọ́ra fún ìmí ẹ̀dùn, a lè wò ó pẹ̀lú omi atá ilé, lẹ́mù àti oyin.',
    'Common respiratory viruses',
    'respiratory',
    array['Sore throat', 'Cough', 'Runny nose', 'Sneezing', 'Mild fever'],
    array['A cluster of mild upper-respiratory symptoms usually caused by seasonal viruses.', 'Warm ginger-lemon-honey infusions are the most widely used Yoruba home remedy for this condition.'],
    'coronavirus', 'Active', 2, 'Low', true),

  ('Stomach Ulcer', 'stomach-ulcer',
    'Àrùn Inú',
    'Ọgbẹ́ inú ìfun tí ó máa ń fa ìrora. A lè mú kí inú balẹ̀ pẹ̀lú ọgẹ̀dẹ̀ àti ewé igbalẹ̀.',
    'Peptic ulcer disease',
    'digestive',
    array['Burning stomach pain', 'Bloating', 'Nausea', 'Loss of appetite', 'Heartburn'],
    array['Ulcers are sores in the lining of the stomach or small intestine, often worsened by stress and poor diet.', 'Unripe plantain and moringa are commonly prescribed in Yoruba tradition to soothe the gut lining.'],
    'stomach', 'Active', 3, 'Medium', true),

  ('Hypertension', 'hypertension',
    'Àrùn Ẹ̀jẹ̀ Gíga',
    'Títẹ̀ ẹ̀jẹ̀ tí ó ga ju. A lè ran ara lọ́wọ́ pẹ̀lú ewé igbalẹ̀ àti òrúnbó.',
    'Primary hypertension',
    'cardiovascular',
    array['Headaches', 'Dizziness', 'Fatigue', 'Chest discomfort', 'Blurred vision'],
    array['Long-term elevation of blood pressure that silently damages the heart and kidneys.', 'Moringa and hibiscus (zobo) are two widely consumed Yoruba herbs supporting healthy blood pressure.'],
    'monitor_heart', 'Active', 4, 'High', false),

  ('Diabetes', 'diabetes',
    'Àrùn Ṣúgà',
    'Àìsàn tó jẹ́ pé ṣúgà púpọ̀ wà nínú ẹ̀jẹ̀. Ewúro àti ewé ẹ̀gúsí máa ń ràn án lọ́wọ́.',
    'Diabetes mellitus',
    'endocrine',
    array['Frequent urination', 'Excessive thirst', 'Unexplained weight loss', 'Fatigue', 'Slow wound healing'],
    array['A metabolic disorder marked by high blood sugar from insufficient or ineffective insulin.', 'Bitter leaf extract is a staple Yoruba remedy believed to help regulate blood sugar.'],
    'bloodtype', 'Active', 4, 'High', true)
on conflict (slug) do update
set yoruba_name = excluded.yoruba_name,
    yoruba_description = excluded.yoruba_description,
    scientific_name = excluded.scientific_name,
    category = excluded.category,
    symptoms = excluded.symptoms,
    description = excluded.description,
    icon = excluded.icon,
    status = excluded.status,
    severity = excluded.severity,
    severity_label = excluded.severity_label,
    is_featured = excluded.is_featured;

-- ─────────────────────────────────────────────────────────────
-- 3. Insert 6 remedies
-- ─────────────────────────────────────────────────────────────

insert into public.remedies (name, slug, yoruba_name, yoruba_description, scientific_name, type, prep_time, description, short_description, preparation_steps, ingredients, dosage, duration, precautions, is_active, is_featured)
values
  ('Neem Bark Decoction', 'neem-bark-decoction',
    'Omi Dogoyaro',
    'Omi dogoyaro ni ojútùú ìbílẹ̀ fún ibà. Ó kórò, ṣùgbọ́n ó ń wò àrùn sàn.',
    'Azadirachta indica',
    'Bark', '30 minutes',
    'A traditional bitter decoction from neem bark, long used in Yoruba medicine for feverish illnesses, especially malaria.',
    'Bitter neem-bark tea for malaria and fevers.',
    E'Rinse the bark: Wash a handful of neem bark thoroughly.\nBoil: Simmer in 1.5 litres of water for 25–30 minutes until dark brown.\nStrain: Pour into a clean container and let it cool slightly.',
    '[{"name":"Neem bark","quantity":"Handful"},{"name":"Water","quantity":"1.5 L"}]'::jsonb,
    'Half a cup, twice daily on an empty stomach',
    '5–7 days or until fever subsides',
    E'Not for pregnant women\nAvoid in children under 5 without guidance\nStop if gastric irritation occurs',
    true, true),

  ('Bitter Leaf Extract', 'bitter-leaf-extract',
    'Omi Ewúro',
    'Ewúro ń ràn ẹ̀jẹ̀ lọ́wọ́ àti ó ń mú ara túú.',
    'Vernonia amygdalina',
    'Leaf', '15 minutes',
    'The squeezed juice of fresh bitter leaves. Central to Yoruba home medicine for blood sugar, digestion, and general cleansing.',
    'Fresh bitter-leaf juice for blood sugar and digestion.',
    E'Wash leaves: Rinse fresh bitter leaves under clean water.\nSqueeze: Crush by hand with a little water, then strain through a clean cloth.\nDilute: Mix a small cup of the extract with twice the volume of warm water.',
    '[{"name":"Fresh bitter leaves","quantity":"2 cups"},{"name":"Water","quantity":"2 cups"}]'::jsonb,
    '¼ cup in the morning before food',
    'Up to 2 weeks, then rest',
    E'Very bitter — start with small amounts\nNot for those on diabetes medication without supervision',
    true, true),

  ('Ginger Lemon Honey Tea', 'ginger-lemon-honey-tea',
    'Tii Atá Ilé, Lẹ́mù àti Oyin',
    'Ó ń mú ọ̀fun rọ̀ àti ó ń wò ikọ́ sàn.',
    'Zingiber officinale + Citrus limon',
    'Tea', '10 minutes',
    'A soothing warm infusion to ease coughs, sore throats, and mild fevers. One of the most beloved Yoruba household remedies.',
    'Warm, calming tea for coughs and colds.',
    E'Slice: Peel and thinly slice fresh ginger.\nBoil: Simmer ginger in water for 8 minutes.\nFinish: Remove from heat, squeeze in lemon juice, stir in honey.',
    '[{"name":"Fresh ginger","quantity":"3 slices"},{"name":"Lemon","quantity":"½"},{"name":"Raw honey","quantity":"1 tbsp"},{"name":"Water","quantity":"300 ml"}]'::jsonb,
    '1 cup up to 3 times daily while symptoms persist',
    'As needed',
    E'Do not give honey to infants under 1 year\nMay thin blood — caution with blood thinners',
    true, true),

  ('Unripe Plantain Powder', 'unripe-plantain-powder',
    'Ẹ̀fọ́ Ọgẹ̀dẹ̀ Àì-pọ́n',
    'Ó máa ń tu inú àwọn tí wọ́n ní àrùn inú lẹ́yìn tí wọ́n jẹ ẹ́.',
    'Musa paradisiaca',
    'Root', '1 hour (preparation)',
    'Dried unripe plantain ground into a fine flour, eaten as swallow or porridge to soothe ulcers and support blood sugar.',
    'Gut-friendly flour for ulcer relief.',
    E'Peel: Skin unripe plantains.\nDry: Slice thin and sun-dry (or oven-dry on low heat) until fully dry.\nGrind: Blend into a fine flour and store airtight.',
    '[{"name":"Unripe plantain","quantity":"5 fingers"}]'::jsonb,
    'Prepare as a light porridge once daily',
    'Ongoing, as diet staple',
    E'Combine with balanced vegetables\nNot a sole treatment — pair with medical care for serious ulcers',
    true, false),

  ('Moringa Hibiscus Infusion', 'moringa-hibiscus-infusion',
    'Tii Ewé Ewéro pẹ̀lú Zobo',
    'Ó ń ràn ara lọ́wọ́ láti din títẹ̀ ẹ̀jẹ̀ gíga kù.',
    'Moringa oleifera + Hibiscus sabdariffa',
    'Tea', '15 minutes',
    'A vibrant red infusion pairing moringa leaves with hibiscus petals, traditionally taken to support healthy blood pressure.',
    'Heart-friendly moringa & hibiscus tea.',
    E'Rinse: Wash moringa leaves and hibiscus petals.\nSteep: Pour just-boiled water over them and cover for 10 minutes.\nStrain: Serve warm, optionally with a touch of honey.',
    '[{"name":"Dried hibiscus petals","quantity":"2 tbsp"},{"name":"Fresh moringa leaves","quantity":"Handful"},{"name":"Water","quantity":"500 ml"}]'::jsonb,
    '1 cup once or twice daily',
    'Several weeks, monitor blood pressure',
    E'May lower blood pressure further — caution on BP medications\nMonitor pregnant women',
    true, true),

  ('Scent Leaf Steam', 'scent-leaf-steam',
    'Èéfín Èfínrín',
    'Èéfín èfínrín ń ṣe ìránṣẹ́ fún ikọ́ àti òtùtù.',
    'Ocimum gratissimum',
    'Leaf', '20 minutes',
    'A therapeutic steam inhalation using scent-leaf, helpful for nasal congestion and sinus relief in colds and flu.',
    'Scent-leaf steam for congestion.',
    E'Boil: Bring water with scent leaves to a rolling boil.\nSteam: Remove from heat, cover your head with a towel over the pot, inhale for 5–8 minutes.\nRest: Wipe face, stay warm for 30 minutes after.',
    '[{"name":"Scent leaves","quantity":"2 handfuls"},{"name":"Water","quantity":"2 L"}]'::jsonb,
    'Once or twice daily',
    '3–5 days',
    E'Keep face at safe distance to avoid burns\nNot for asthma flare-ups',
    true, false)
on conflict (slug) do update
set yoruba_name = excluded.yoruba_name,
    yoruba_description = excluded.yoruba_description,
    scientific_name = excluded.scientific_name,
    type = excluded.type,
    prep_time = excluded.prep_time,
    description = excluded.description,
    short_description = excluded.short_description,
    preparation_steps = excluded.preparation_steps,
    ingredients = excluded.ingredients,
    dosage = excluded.dosage,
    duration = excluded.duration,
    precautions = excluded.precautions,
    is_active = excluded.is_active,
    is_featured = excluded.is_featured;

-- ─────────────────────────────────────────────────────────────
-- 4. Link diseases ↔ conditions
-- ─────────────────────────────────────────────────────────────

insert into public.condition_diseases (condition_id, disease_id)
select c.id, d.id
from (values
  ('general-health',   'malaria'),
  ('immune-defense',   'malaria'),
  ('digestive-health', 'typhoid-fever'),
  ('immune-defense',   'typhoid-fever'),
  ('immune-defense',   'cough-and-cold'),
  ('digestive-health', 'stomach-ulcer'),
  ('general-health',   'hypertension'),
  ('energy-vitality',  'hypertension'),
  ('general-health',   'diabetes'),
  ('energy-vitality',  'diabetes')
) as pairs(condition_slug, disease_slug)
join public.conditions c on c.slug = pairs.condition_slug
join public.diseases   d on d.slug = pairs.disease_slug
on conflict (condition_id, disease_id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 5. Link remedies ↔ diseases
-- ─────────────────────────────────────────────────────────────

insert into public.disease_remedy (disease_id, remedy_id, tag)
select d.id, r.id, null
from (values
  ('malaria',         'neem-bark-decoction'),
  ('malaria',         'bitter-leaf-extract'),
  ('typhoid-fever',   'bitter-leaf-extract'),
  ('typhoid-fever',   'scent-leaf-steam'),
  ('cough-and-cold',  'ginger-lemon-honey-tea'),
  ('cough-and-cold',  'scent-leaf-steam'),
  ('stomach-ulcer',   'unripe-plantain-powder'),
  ('hypertension',    'moringa-hibiscus-infusion'),
  ('diabetes',        'bitter-leaf-extract'),
  ('diabetes',        'moringa-hibiscus-infusion')
) as pairs(disease_slug, remedy_slug)
join public.diseases d on d.slug = pairs.disease_slug
join public.remedies r on r.slug = pairs.remedy_slug
on conflict (disease_id, remedy_id) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 6. Sanity check (uncomment to view counts after running)
-- ─────────────────────────────────────────────────────────────
-- select 'diseases'  as entity, count(*) from public.diseases
-- union all select 'remedies', count(*) from public.remedies
-- union all select 'condition_diseases', count(*) from public.condition_diseases
-- union all select 'disease_remedy', count(*) from public.disease_remedy;
