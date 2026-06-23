DROP POLICY "Give public access to images in folder okddj4_0" ON storage.objects;

CREATE POLICY "Give public access to images in folder okddj4_0" 
ON storage.objects 
FOR SELECT 
TO public 
USING (
  bucket_id = 'penginapan-stagging' 
  AND LOWER((storage.foldername(name))[1]) = 'public'
);