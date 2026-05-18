-- Create a bucket for product images if it doesn't exist
-- Note: This is usually done in the dashboard, but we can attempt to create it via SQL if extensions are enabled
-- or just ensure policies are ready.

-- Set up storage policies for 'product-images' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );

create policy "Sellers can upload images"
on storage.objects for insert
with check (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated'
);

create policy "Sellers can update their own images"
on storage.objects for update
using (
  bucket_id = 'product-images' AND
  auth.uid() = owner
);

create policy "Sellers can delete their own images"
on storage.objects for delete
using (
  bucket_id = 'product-images' AND
  auth.uid() = owner
);
