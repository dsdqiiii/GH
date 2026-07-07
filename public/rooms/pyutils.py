import os
import shutil

folder_toilet = './toilet2'
file_target = 'target.jpg'
file_log = 'base.txt'

# Pastikan folder toilet sudah ada
if not os.path.exists(folder_toilet):
    os.makedirs(folder_toilet)

try:
    # 1. Buka dan baca file base.txt
    if not os.path.exists(file_log):
        print(f"Error: File '{file_log}' tidak ditemukan.")
    else:
        with open(file_log, 'r', encoding='utf-8') as f:
            # .read().splitlines() otomatis menghapus karakter enter (\n) di tiap baris
            list_nama = f.read().splitlines()
        
        # Filter jika ada baris kosong di dalam base.txt
        list_nama = [nama for nama in list_nama if nama.strip()]

        if not list_nama:
            print(f"File '{file_log}' kosong, tidak ada nama yang diproses.")
        else:
            # 2. Lakukan looping berdasarkan list dari base.txt
            for nama_baru in list_nama:
                
                # 3. Gabungkan path folder dengan nama file secara aman
                path_tujuan = os.path.join(folder_toilet, nama_baru)
                
                # 4. Eksekusi copy file target.jpg ke ./toilet/nama-dari-base.jpeg
                shutil.copy(file_target, path_tujuan)
                print(f"Berhasil: {file_target} -> {path_tujuan}")

except FileNotFoundError:
    print(f"Terjadi kesalahan: Pastikan file '{file_target}' sudah ada.")
except Exception as e:
    print(f"Terjadi error: {e}")