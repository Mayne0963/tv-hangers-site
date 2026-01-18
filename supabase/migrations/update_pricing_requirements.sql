update site_content
set value = jsonb_set(
  value,
  '{services}',
  jsonb_build_array(
    jsonb_build_object(
      'title',
      'TV Mounting',
      'desc',
      'TV mounting is typically $50–$90 (you provide the TV + wall mount).'
    ),
    jsonb_build_object('title', 'Picture & Art Hanging', 'desc', 'Level, centered placement with the right anchors.'),
    jsonb_build_object('title', 'Wall Hangings', 'desc', 'Mirrors, shelves, and more (by request).')
  ),
  true
)
where key = 'business.info';

update site_content
set value = (
  coalesce(value, '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
      'q',
      'Do I need to have my TV and wall mount already?',
      'a',
      'Yes. For TV mounting, you must have the TV and the wall mount (bracket).'
    )
  )
)
where key = 'faq.items'
  and not (value @> jsonb_build_array(jsonb_build_object('q', 'Do I need to have my TV and wall mount already?')));

