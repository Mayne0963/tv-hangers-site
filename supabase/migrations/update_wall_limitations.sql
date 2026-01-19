update site_content
set value = jsonb_set(
  value,
  '{services}',
  jsonb_build_array(
    jsonb_build_object(
      'title',
      'TV Mounting',
      'desc',
      'TV mounting is typically $50–$80 on drywall (you provide the TV + wall mount).'
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
      'What wall types do you mount on?',
      'a',
      'Drywall only (with studs or without studs).'
    )
  )
)
where key = 'faq.items'
  and not (value @> jsonb_build_array(jsonb_build_object('q', 'What wall types do you mount on?')));

update site_content
set value = (
  coalesce(value, '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
      'q',
      'Do you offer cable concealment?',
      'a',
      'No. We do not offer cable concealment as part of our standard installation options.'
    )
  )
)
where key = 'faq.items'
  and not (value @> jsonb_build_array(jsonb_build_object('q', 'Do you offer cable concealment?')));
