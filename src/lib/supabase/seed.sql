-- =============================================
-- HerbalWisdom Seed Data
-- Run AFTER schema.sql in Supabase SQL Editor
-- =============================================

-- ── Categories ──
INSERT INTO categories (id, name, slug, icon, color, display_order) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Respiratory', 'respiratory', 'air', 'blue', 1),
  ('a0000001-0000-0000-0000-000000000002', 'Digestive', 'digestive', 'sentiment_satisfied', 'orange', 2),
  ('a0000001-0000-0000-0000-000000000003', 'Immunity', 'immunity', 'shield', 'green', 3),
  ('a0000001-0000-0000-0000-000000000004', 'Skin Care', 'skin', 'face_3', 'pink', 4),
  ('a0000001-0000-0000-0000-000000000005', 'Stress Relief', 'stress', 'psychology', 'purple', 5);

-- ── Remedies ──
INSERT INTO remedies (id, name, scientific_name, slug, type, prep_time, description, short_description, image, dosage, duration, precautions, is_active, is_featured, ingredients, preparation_steps) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'Echinacea', 'Echinacea purpurea', 'echinacea', 'Tea / Infusion', '20 min prep',
   'Echinacea purpurea is a flowering plant in the sunflower family that is native to North America. It is one of the most popular herbs worldwide, traditionally used by Indigenous peoples of the Great Plains for various ailments. Today, it is best known as an over-the-counter herbal remedy for the common cold or flu. The plant contains a complex mix of active substances, some of which are thought to be antimicrobial, while others are believed to exert an effect on the human immune system.',
   'Often used to boost the immune system and fight the common cold. Rich in antioxidants and alkamides.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDjFY5PiLn-5inZKi1Anb0grDpc3_5MXb9ulD8wyyw2UbeyBH69AfJ7clU0jiadUCHzHSxAWzZ5r08npLoHLUVhN6raCWACTjGFW6O1I5n953w5jgqzZQhD_TVg2ojmgfih0-cCNml6gq2giPxcQIlofftFnYZR6nNIHUv_0kVlyxb-q_8e45rXimZ7lQ5pB3AgHUnARgyDO2rxA7M_GSmKA6D2pAmINzsYt6ySG0UbiCETH9txSIQMMkBPdR3cH2GiIzdxvSJ5pUg',
   'Drink 1 cup of tea, up to 3 times daily. For tinctures, typically 2-3ml three times a day.',
   '1-2 weeks at the onset of symptoms',
   'Consult a physician if pregnant or breastfeeding. May cause allergic reactions in people sensitive to ragweed. Do not use with autoimmune disorders.',
   true, true,
   '[{"name":"Dried Echinacea root or leaves","quantity":"1 tsp"},{"name":"Boiling water","quantity":"1 cup"}]',
   '1. Gather 1 teaspoon of dried Echinacea root or leaves and 1 cup of boiling water.\n2. Pour boiling water over the herb. Cover and steep for 10-15 minutes.\n3. Strain the tea into a cup. Add honey or lemon to taste. Drink warm.'),

  ('b0000001-0000-0000-0000-000000000002', 'Ginger Root', 'Zingiber officinale', 'ginger', 'Tea / Decoction', '15 min prep',
   'A powerful warming root that stimulates digestive fire, reduces nausea, and fights inflammation throughout the digestive tract.',
   'A powerful root that soothes digestion, reduces nausea, and fights inflammation throughout the body.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA',
   '1-2 cups daily', '2-4 weeks', 'May interact with blood thinners.', true, true, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000003', 'Lavender', 'Lavandula angustifolia', 'lavender', 'Essential Oil / Tea', '10 min prep',
   'Known for its calming fragrance, lavender helps reduce stress, anxiety, and promotes better sleep quality.',
   'Known for its calming fragrance, lavender helps reduce stress, anxiety, and promotes better sleep quality.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAOOn-JJcKUI5gDC9PUjbE--G1WhDYrcivi32TqdY2XMuacnndgpuQ1pV8TbLeCTzZ5pLc7r4MZFaHrOJvvEhBRWO1nIUOXfJYeBqZYu_6WUIsM-XRMOrJptecycLIMpRnSfpJeY5zIcYjgmVqVbbG0Npz_ps2c3MfmdsoynuLGLgYUTonbzs_Js3nV0OG_PRLCZpMCp_kjCvtMLjtq-uPCxMt9Ego2dA1U8igTqHiWnQ7MLVK23ZtU8JQq3VIDL93GmVsQQRVfC-o',
   '1 cup before bed', '2-4 weeks', 'Avoid during pregnancy.', true, true, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000004', 'Elderberry', 'Sambucus nigra', 'elderberry', 'Syrup', '60 min prep',
   'A classic winter wellness staple. This potent syrup combines elderberries, raw honey, ginger, and cinnamon to support immune function during the cold season.',
   'Rich in antioxidants and vitamins, elderberry may help tame inflammation and reduce flu duration.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDQ9NPFN1xyhmYKhbXexx5RIizG9XF1IklEElIppJZlic93XoPv9u5diQ6bcwwZrBmC8Yp99QmPGU1EOQk_h2m3oBipM1gxmG6R0wyzl8gnPm3ZEgXoAMIPhqR6f_vD7DurmQ29cEn4MYCA_eY6rIrxcKPOztyfS5BItT2Z7B9wvlDCpGq25BFem4ALgDQ6GE7NW7jcl8t5DGlDwRkCn4Fai1vRGB-DunzeKWVeyAIvQzFd3cvoaH-aJWlOdVzaP1ixl-0JEivNtS0',
   '1 tablespoon daily', '2-4 weeks', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000005', 'Goldenseal', 'Hydrastis canadensis', 'goldenseal', 'Tincture', '4-6 weeks prep',
   'Contains berberine, which has antibacterial and anti-inflammatory properties.',
   'Contains berberine with antibacterial and anti-inflammatory properties.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCp6T0K4C4kIuxye-UswaF-7_b9aODnjzQ2QGXkM3NxIXtcOrViSJHy1-bIfZcGCjbf28NyFLyaCUR5XP_2_hcd73hz555dgD4RBpnNJ1JB3EL7oBcIrkNxPUIvOAAmjwc65CbUMFPwRf_fbt-sbXssKBg-tZNlSo7uzEfkkIakIhM4ihR5zsK6CHKnAbrB0vcvO09KA9nql_83rKkUTVl6hWxgSAOc8WFRVCi9QguCUxij5hH7x_DWEyIjJxrVrCDrOnNZgXyo7QU',
   '2-3ml tincture 3x daily', '1-2 weeks', 'Not for long-term use.', true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000006', 'Astragalus', 'Astragalus membranaceus', 'astragalus', 'Decoction', '30 min prep',
   'An adaptogenic herb used in Traditional Chinese Medicine to strengthen the immune system.',
   'An adaptogenic herb used in TCM to strengthen the immune system.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDRhu4G6jbOcaqVvobc5D3l4Bzvl4IARGX1RMYiwrpqM6AqAyzUBlUAGnyS648pKNJrVIqqUasFiXR90KOsbPxRdCCkoL6qUpWr_G6MO-6ZGWIcwlXSlE-q9Rfl6UsF36EwXc9Q9GS8aek2LAj73nw6JvIJd-7fr-AzihB7bk7O0Bk9eKztCvj9QZKosz8l-yRh3H7Yu1VwR91CWR-5VJbrMjWqZNpScUpPta1MrqSIEm4Z5kson4UdGpXwzc4JQKhXIDpf4bZl6u4',
   '1-2 cups daily', '4-8 weeks', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000007', 'Mullein Leaf Infusion', 'Verbascum thapsus', 'mullein', 'Tea / Infusion', '20 min prep',
   'A gentle yet effective lung tonic used for centuries to soothe dry, hacking coughs. Mullein leaf tea is rich in mucilage which coats and protects irritated tissues.',
   'A gentle lung tonic for dry coughs.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAOOn-JJcKUI5gDC9PUjbE--G1WhDYrcivi32TqdY2XMuacnndgpuQ1pV8TbLeCTzZ5pLc7r4MZFaHrOJvvEhBRWO1nIUOXfJYeBqZYu_6WUIsM-XRMOrJptecycLIMpRnSfpJeY5zIcYjgmVqVbbG0Npz_ps2c3MfmdsoynuLGLgYUTonbzs_Js3nV0OG_PRLCZpMCp_kjCvtMLjtq-uPCxMt9Ego2dA1U8igTqHiWnQ7MLVK23ZtU8JQq3VIDL93GmVsQQRVfC-o',
   '1-2 cups daily', '1-2 weeks', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000008', 'Thyme Steam', 'Thymus vulgaris', 'thyme', 'Steam Inhalation', '10 min prep',
   'Utilizing the volatile oils of garden thyme, this steam inhalation helps to open bronchial passages and loosen congestion deep in the chest.',
   'Opens bronchial passages and loosens congestion.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDjFY5PiLn-5inZKi1Anb0grDpc3_5MXb9ulD8wyyw2UbeyBH69AfJ7clU0jiadUCHzHSxAWzZ5r08npLoHLUVhN6raCWACTjGFW6O1I5n953w5jgqzZQhD_TVg2ojmgfih0-cCNml6gq2giPxcQIlofftFnYZR6nNIHUv_0kVlyxb-q_8e45rXimZ7lQ5pB3AgHUnARgyDO2rxA7M_GSmKA6D2pAmINzsYt6ySG0UbiCETH9txSIQMMkBPdR3cH2GiIzdxvSJ5pUg',
   '2-3 times daily', 'As needed', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000009', 'Elecampane Root', 'Inula helenium', 'elecampane', 'Tincture', '4-6 weeks prep',
   'A warming, aromatic root traditionally used for "damp" chest conditions. This alcohol extract captures the resins responsible for clearing stuck mucus.',
   'Warming root for damp chest conditions.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA',
   '2-3ml 3x daily', '2-4 weeks', 'Use with caution.', true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000010', 'Marshmallow Root', 'Althaea officinalis', 'marshmallow-root', 'Cold Infusion', '4 hours prep',
   'Best prepared with cold water to preserve its soothing mucilage, this root is excellent for dry, irritated throats and unproductive coughs.',
   'Soothing mucilage for dry throats.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBYJdtEiA_xFxcCrqA3HFRRw7IyeVPWHRqdeYMZYJoaiw3LogD3pRKG6nh7Ukw1f8M0eDP210O9ZtMwO3fAsJtlAzumCUyfT-WCSSXO9AGc7ROhghk1l-QTCTenHMCe0nIAC2YCaB-E4KBNMkRrvnK09e9_GmjaYiuRZToUFB8iW9cr6cXD4qWv-Ttu0eTed0kb8qMmOpHyQzfYvWhUuB5yeyHteiF9tORPUT7LvE6A0ypAk9tXFIhhgU9U_zRG9YqFaFTxE6XvCIY',
   '1-2 cups daily', 'As needed', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000011', 'Wild Cherry Bark', 'Prunus serotina', 'wild-cherry-bark', 'Syrup / Elixir', '30 min prep',
   'A powerful sedative for the cough reflex. Traditionally used for spasmodic coughing that interrupts sleep. Use with caution and respect.',
   'Cough suppressant for spasmodic coughs.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dxt_QP7ahDad4OCeVZ_yGAsUcMJvpNsY2g_q6Dj879XaMKhfMJayAx6Cca9o-TFMNtefN3boaidoDGSh7RevGtrQGFgYLHz8mS4Xq4C8tVte6IlldMkoC5EdYVut5YMW3AomZjORFCUdKAmR5QW_J__1M2cIT_2eyq2rlvuOSX7ES5vj7hJL1wvuj1bj3Q5kb1fbxA5Gd6bJtmdU9l9gkvs71QCwZCPOXKu-3-6FUl5PkLXOFSGIbu2ipDKtZlqcz55UHeC35dQ',
   '1 tsp 3x daily', '1 week', 'Use with caution.', true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000012', 'Peppermint Infusion', 'Mentha piperita', 'peppermint', 'Tea / Infusion', '10 min prep',
   'A soothing and cooling herb that relaxes the smooth muscles of the GI tract, relieving bloating, gas, and indigestion naturally.',
   'Cooling herb for digestive relief.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAOOn-JJcKUI5gDC9PUjbE--G1WhDYrcivi32TqdY2XMuacnndgpuQ1pV8TbLeCTzZ5pLc7r4MZFaHrOJvvEhBRWO1nIUOXfJYeBqZYu_6WUIsM-XRMOrJptecycLIMpRnSfpJeY5zIcYjgmVqVbbG0Npz_ps2c3MfmdsoynuLGLgYUTonbzs_Js3nV0OG_PRLCZpMCp_kjCvtMLjtq-uPCxMt9Ego2dA1U8igTqHiWnQ7MLVK23ZtU8JQq3VIDL93GmVsQQRVfC-o',
   '1-3 cups daily', '2-4 weeks', 'Avoid with GERD.', true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000013', 'Fennel Seed', 'Foeniculum vulgare', 'fennel', 'Tea / Infusion', '10 min prep',
   'A gentle carminative that helps expel gas and ease cramping. Fennel has been used since antiquity for colic and digestive comfort.',
   'Gentle carminative for gas and cramping.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDjFY5PiLn-5inZKi1Anb0grDpc3_5MXb9ulD8wyyw2UbeyBH69AfJ7clU0jiadUCHzHSxAWzZ5r08npLoHLUVhN6raCWACTjGFW6O1I5n953w5jgqzZQhD_TVg2ojmgfih0-cCNml6gq2giPxcQIlofftFnYZR6nNIHUv_0kVlyxb-q_8e45rXimZ7lQ5pB3AgHUnARgyDO2rxA7M_GSmKA6D2pAmINzsYt6ySG0UbiCETH9txSIQMMkBPdR3cH2GiIzdxvSJ5pUg',
   '1-2 cups daily', '2-4 weeks', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000014', 'Sage', 'Salvia officinalis', 'sage', 'Mouth Rinse', '15 min prep',
   'Effective for reducing gum inflammation and killing bacteria.',
   'Anti-inflammatory mouth rinse.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuC1hDAQu2hgiHQf7MC6gsnghTJD_vVyCzVBQVkE6I1JTKbuniPo881VvEeXUhAMUKCtqc-v9JcJXFQ7zU-Z0lByZcOpE_I8Y_O0EgmcM66_AmyUlyNOVMUaYFKotl4Nxclrw8VAPWSqJ59irK9Js64MvjCZ325CIH7CgMeAXwfEcwTkoVSxPSviUzeh_oA2sqNil7bCBSNHIPwu5syAFt374TBUepCZrB3_32SAqOIWWGN-J1P2upFij1j-5ocJj44PqWwxGgT6mzI',
   'Rinse 2-3x daily', '2 weeks', NULL, true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000015', 'Turmeric Paste', 'Curcuma longa', 'turmeric-paste', 'Paste', '5 min prep',
   'Curcumin in turmeric has anti-inflammatory properties.',
   'Anti-inflammatory paste.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbFqtHKkdr1zY17c1eEc2clYZJKwpRl2qDWlCHwlMu3urcOZS4IdifAbfyRXKUEu01AdQYPRlJHNQ9ZSY5blv4hyDKZMAalxaxilmKkkYEkGZA69Gud6x8qjQyrPR4TEWlSQFwYt6UICA4K-TZSGudmZ49GTZoGkluiOAGm35WH__XaflxOx5HpXc8yu1kiWWzYH854OtE_LHI9RVpWYkGi_KDYWQdu3-ruDxzdVYFg_wFlEsyuf45R1YUbr2hSC6ZX8jdtm3q0Y',
   'Apply 2x daily', '1-2 weeks', 'May stain.', true, false, '[]', NULL),

  ('b0000001-0000-0000-0000-000000000016', 'Aloe Vera', 'Aloe barbadensis', 'aloe-vera', 'Gel', '5 min prep',
   'Reduces bleeding and gum swelling.',
   'Soothing gel for gums.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAytdU6lp_-A9TVq2ZyiezEaEq13-vYHnquGdISMuDx8v15J7vsBYIw4dMlXLyapqIwnkUTMVq2PlXl5WoFJ8OZOnje1fd6P4yPTDc6a87AuFM0keqwaYNM9cA9lnr9iInVFGfcnbc0LIBUuD2coHQvDhReSQvY7-BV--HsTQXFfm1wMwI1KWrD7uFKxVuhvAlMOhd2sX8Ioy89crWZKYbfkFfdI1EZh03O845rCjbK0dyjCMEAmU-YphW-mq-DlOjFyRuy_Zk5I7Y',
   'Apply directly 2-3x daily', '2 weeks', NULL, true, false, '[]', NULL);

-- ── Conditions ──
INSERT INTO conditions (id, name, slug, description, icon, icon_bg, badge_icon, image, safety_note, safety_link, category_id, remedy_count) VALUES
  ('c1000001-0000-0000-0000-000000000001', 'Digestive Health', 'digestive-health',
   'Natural support for your gut and digestive system. These traditional remedies are curated to help soothe bloating, indigestion, and gut inflammation with gentle bitters and carminative herbs.',
   'spa', 'bg-secondary/10 text-primary', 'medication_liquid',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA',
   'Digestive herbs can interact with prescription medications. Always consult with a qualified healthcare practitioner.',
   'Read our full Digestive Safety Guide',
   'a0000001-0000-0000-0000-000000000002', 12),

  ('c1000001-0000-0000-0000-000000000002', 'Sleep Support', 'sleep-support',
   'Find deep restorative rest with nervines and sedatives. Explore Valerian, Chamomile, and Passionflower for insomnia and restlessness.',
   'nights_stay', 'bg-indigo-100 text-indigo-600', 'bedtime',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCPidraaHnbAATk7Qs0-w6WwtUy8txoLvCCjw08DeyWob3PdyfnwF9aJ7IVeGqvVh3JO7ktm1KuthEgrSIfgfTyjR7-x_Ap5tT8s839u4aOyve9iFdV8e0cuSGgcfAy6w5ah3Oe8JKhwQt2-U5JuyLZIx7UlHGroAviIZGAGxu-D8c_NaFt5RPvwSx1vC7jsyx7HRmMppauezfxXWY1lcv53-w62bDrqdroaaghFj0wAeCOSKQjbgUo0CBKO6yVTC4pSBLzTC5Fyok',
   'Sleep herbs can cause drowsiness. Do not operate heavy machinery.', 'Read our full Sleep Safety Guide',
   'a0000001-0000-0000-0000-000000000005', 8),

  ('c1000001-0000-0000-0000-000000000003', 'Stress & Anxiety', 'stress-anxiety',
   'Restore balance to your nervous system with adaptogens. Ashwagandha, Holy Basil, and Lemon Balm help manage daily stressors.',
   'self_improvement', 'bg-amber-100 text-amber-600', 'psychology',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAOOn-JJcKUI5gDC9PUjbE--G1WhDYrcivi32TqdY2XMuacnndgpuQ1pV8TbLeCTzZ5pLc7r4MZFaHrOJvvEhBRWO1nIUOXfJYeBqZYu_6WUIsM-XRMOrJptecycLIMpRnSfpJeY5zIcYjgmVqVbbG0Npz_ps2c3MfmdsoynuLGLgYUTonbzs_Js3nV0OG_PRLCZpMCp_kjCvtMLjtq-uPCxMt9Ego2dA1U8igTqHiWnQ7MLVK23ZtU8JQq3VIDL93GmVsQQRVfC-o',
   'Some adaptogens may interact with medications.', 'Read our full Stress Safety Guide',
   'a0000001-0000-0000-0000-000000000005', 15),

  ('c1000001-0000-0000-0000-000000000004', 'Immune Defense', 'immune-defense',
   'Strengthen your body''s natural defenses. Elderberry, Echinacea, and Astragalus provide vital support during seasonal changes.',
   'medical_services', 'bg-red-100 text-red-600', 'shield',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDjFY5PiLn-5inZKi1Anb0grDpc3_5MXb9ulD8wyyw2UbeyBH69AfJ7clU0jiadUCHzHSxAWzZ5r08npLoHLUVhN6raCWACTjGFW6O1I5n953w5jgqzZQhD_TVg2ojmgfih0-cCNml6gq2giPxcQIlofftFnYZR6nNIHUv_0kVlyxb-q_8e45rXimZ7lQ5pB3AgHUnARgyDO2rxA7M_GSmKA6D2pAmINzsYt6ySG0UbiCETH9txSIQMMkBPdR3cH2GiIzdxvSJ5pUg',
   'Immune herbs may interact with immunosuppressants.', 'Read our full Immune Safety Guide',
   'a0000001-0000-0000-0000-000000000003', 9),

  ('c1000001-0000-0000-0000-000000000005', 'Skin Health', 'skin-health',
   'Nurture your skin from the inside out and outside in. Calendula, Aloe Vera, and Burdock Root for radiance and healing.',
   'face', 'bg-pink-100 text-pink-600', 'dermatology',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBEcWivAh5NgmPtC3SfYgNHgLqku-7_PneOYfd592lXgGruysqiXuKssrJSddeFOZwjQSk8-9p-9mOyiziGTJ46P0YNl7sZ1PVmie6JKcWJOJrW6TsTgAGxDhqA-PxLiYBSYFwhER2Ny5JdNmohPuNEEwnp32HDvIpiX-HDljL6zkbmvqyBgX4S8QhdMfz9RPSDMtPU906KywautmIcc_uO63ZHRD4R2a7WCrmt0X-ve9CpEihsTRNqrrfs5pSuAN_SVL3XrX_e4fA',
   'Topical herbs may cause allergic reactions. Patch test first.', 'Read our full Skin Safety Guide',
   'a0000001-0000-0000-0000-000000000004', 7),

  ('c1000001-0000-0000-0000-000000000006', 'Energy & Vitality', 'energy-vitality',
   'Combat fatigue and boost stamina naturally. Rhodiola, Ginseng, and Maca provide sustained energy without the crash.',
   'offline_bolt', 'bg-yellow-100 text-yellow-600', 'bolt',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dxt_QP7ahDad4OCeVZ_yGAsUcMJvpNsY2g_q6Dj879XaMKhfMJayAx6Cca9o-TFMNtefN3boaidoDGSh7RevGtrQGFgYLHz8mS4Xq4C8tVte6IlldMkoC5EdYVut5YMW3AomZjORFCUdKAmR5QW_J__1M2cIT_2eyq2rlvuOSX7ES5vj7hJL1wvuj1bj3Q5kb1fbxA5Gd6bJtmdU9l9gkvs71QCwZCPOXKu-3-6FUl5PkLXOFSGIbu2ipDKtZlqcz55UHeC35dQ',
   'Stimulating herbs may affect sleep if taken late.', 'Read our full Energy Safety Guide',
   'a0000001-0000-0000-0000-000000000003', 10);

-- ── Condition Remedy (junction) ──
INSERT INTO condition_remedy (condition_id, remedy_id, display_order, icons) VALUES
  ('c1000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000012', 1, '[{"icon":"child_care","title":"Safe for children"},{"icon":"restaurant","title":"After meals"}]'),
  ('c1000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 2, '[{"icon":"flash_on","title":"Quick Relief"}]'),
  ('c1000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000013', 3, '[{"icon":"child_care","title":"Safe for children"},{"icon":"water_drop","title":"Soothing"}]'),
  ('c1000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000001', 1, '[{"icon":"shield","title":"Immune Support"}]'),
  ('c1000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000004', 2, '[{"icon":"shield","title":"Immune Support"}]'),
  ('c1000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000006', 3, '[{"icon":"flash_on","title":"Vitality"}]');

-- ── Diseases ──
INSERT INTO diseases (id, name, slug, scientific_name, category, description, symptoms, icon, hero_image, status, severity, severity_label, tags, views_count, saves_count, is_featured, created_by) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'Influenza', 'influenza', NULL, 'Respiratory', '{}', '{"Fever or chills","Cough and sore throat","Runny or stuffy nose","Muscle or body aches","Headaches and fatigue"}', NULL, NULL, 'Active', 60, 'Moderate', '{"#flu","#respiratory","#viral"}', 1200, 89, false, NULL),
  ('d0000001-0000-0000-0000-000000000002', 'Rheumatoid Arthritis', 'rheumatoid-arthritis', NULL, 'Inflammatory', '{}', '{"Joint pain","Swelling","Stiffness","Fatigue"}', NULL, NULL, 'Active', 70, 'Severe', '{"#joints","#inflammation","#autoimmune"}', 890, 67, false, NULL),
  ('d0000001-0000-0000-0000-000000000003', 'Chronic Insomnia', 'chronic-insomnia', NULL, 'Neurological', '{}', '{"Difficulty falling asleep","Waking during the night","Daytime fatigue","Irritability"}', NULL, NULL, 'Draft', 50, 'Moderate', '{"#sleep","#neurological"}', 560, 45, false, NULL),
  ('d0000001-0000-0000-0000-000000000004', 'Gastritis', 'gastritis', NULL, 'Digestive', '{}', '{"Stomach pain","Nausea","Bloating","Indigestion"}', NULL, NULL, 'Active', 45, 'Moderate', '{"#stomach","#digestive","#inflammation"}', 780, 56, false, NULL),
  ('d0000001-0000-0000-0000-000000000005', 'Gingivitis', 'gingivitis', 'Gingivitis simplex', 'Oral Health',
   '{"Gingivitis is a common and mild form of gum disease (periodontal disease) that causes irritation, redness and swelling (inflammation) of your gingiva, the part of your gum around the base of your teeth. It''s important to take gingivitis seriously and treat it promptly. Gingivitis can lead to much more serious gum disease called periodontitis and tooth loss.","The most common cause of gingivitis is poor oral hygiene. Good oral health habits, such as brushing at least twice a day, flossing daily and getting regular dental checkups, can help prevent and reverse gingivitis."}',
   '{"Swollen or puffy gums","Dark red gums","Gums that bleed easily when you brush or floss","Bad breath","Receding gums","Tender gums"}',
   'dentistry',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAytdU6lp_-A9TVq2ZyiezEaEq13-vYHnquGdISMuDx8v15J7vsBYIw4dMlXLyapqIwnkUTMVq2PlXl5WoFJ8OZOnje1fd6P4yPTDc6a87AuFM0keqwaYNM9cA9lnr9iInVFGfcnbc0LIBUuD2coHQvDhReSQvY7-BV--HsTQXFfm1wMwI1KWrD7uFKxVuhvAlMOhd2sX8Ioy89crWZKYbfkFfdI1EZh03O845rCjbK0dyjCMEAmU-YphW-mq-DlOjFyRuy_Zk5I7Y',
   'Active', 40, 'Moderate', '{"#gums","#inflammation","#oral_hygiene","#bacteria"}', 2400, 145, false, NULL);

-- ── Disease Remedy (junction) ──
INSERT INTO disease_remedy (disease_id, remedy_id, tag) VALUES
  ('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'Immune Support'),
  ('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000002', 'Anti-inflammatory'),
  ('d0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000014', 'Anti-inflammatory'),
  ('d0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000015', 'Antioxidant'),
  ('d0000001-0000-0000-0000-000000000005', 'b0000001-0000-0000-0000-000000000016', 'Soothing');

-- ── Team Members ──
INSERT INTO team_members (id, name, role, bio, image, display_order) VALUES
  ('e0000001-0000-0000-0000-000000000001', 'Dr. Sarah Chen', 'Lead Botanist & PhD', 'Specializes in Traditional Chinese Medicine and native flora identification.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYJdtEiA_xFxcCrqA3HFRRw7IyeVPWHRqdeYMZYJoaiw3LogD3pRKG6nh7Ukw1f8M0eDP210O9ZtMwO3fAsJtlAzumCUyfT-WCSSXO9AGc7ROhghk1l-QTCTenHMCe0nIAC2YCaB-E4KBNMkRrvnK09e9_GmjaYiuRZToUFB8iW9cr6cXD4qWv-Ttu0eTed0kb8qMmOpHyQzfYvWhUuB5yeyHteiF9tORPUT7LvE6A0ypAk9tXFIhhgU9U_zRG9YqFaFTxE6XvCIY', 1),
  ('e0000001-0000-0000-0000-000000000002', 'Marcus Thorne', 'Clinical Herbalist', 'Expert in Western Herbalism with 20 years of clinical practice.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7dxt_QP7ahDad4OCeVZ_yGAsUcMJvpNsY2g_q6Dj879XaMKhfMJayAx6Cca9o-TFMNtefN3boaidoDGSh7RevGtrQGFgYLHz8mS4Xq4C8tVte6IlldMkoC5EdYVut5YMW3AomZjORFCUdKAmR5QW_J__1M2cIT_2eyq2rlvuOSX7ES5vj7hJL1wvuj1bj3Q5kb1fbxA5Gd6bJtmdU9l9gkvs71QCwZCPOXKu-3-6FUl5PkLXOFSGIbu2ipDKtZlqcz55UHeC35dQ', 2),
  ('e0000001-0000-0000-0000-000000000003', 'Elara Vance', 'Holistic Nutritionist', 'Focuses on food as medicine and integrating herbs into daily meals.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD81WU5QL4QuytVnozGyHK2xfTpeuXmD2wfXv3rELN2xGgQ_0ZEx1P9WwJS-fLZzrUiYmJSKxWOvfaRblsCmuFUIlUv_7BvEF1GhEqa6FnkH76wHF42MVzQ4IQfQ3WIVUassciTrN1clWscW7_tfn1OXRyWGtIsu_rtwhqi_8fsm69dpoG0I3fx_IUvZolM1aqDxZE_JLSfRjl72o-4h4p_oeMM6rTzlWKkCoXOJGvrGtFe-1IIG4FoMcjjIBkRrzf3hsoRdiIFInA', 3),
  ('e0000001-0000-0000-0000-000000000004', 'James Wilson', 'Master Gardener', 'Oversees our medicinal gardens and sustainable harvesting practices.', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrjruFkuyhCGIE5VItmjBQa_ihCgmsXvyJjghx9EqXIjJ9GZ08nswt660GFhZ1frh-V5gfZTD8m_V5LsbAWmdWHgpEpIxQSurrrDzsa53jwM9iXbzBcT0GXppWIliE1SOcHNKW79X8LT-Qxf9yPNmGUMcbdfTj1Wd7esaG1lV3eH4kE45SAviQFLv-uivj89NjwtF6kUYjegiWBlXuonZW3Lqbq5lUD_coJcdvK5yPZ4TiDWbs9dZvmvAGchDZgFgBKCU6gMLJpCE', 4);

-- ── Profiles (admin users) ──
INSERT INTO profiles (id, name, email, avatar_url, role, status, last_active_at) VALUES
  ('f0000001-0000-0000-0000-000000000001', 'Alex Morgan', 'alex.morgan@herbaladmin.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz6b5gX1rEfBqxEDcB-NoapXL_fJ0K0zNwkSPCK_MNJn4DXWOJG7uxmw2na8z-Ak6z5DEgSmSXJgHzWhZUYnLGlvs54NZUi6kFIJKCp5Lj1YKw-ELFyTPZCRCBsmkr1-S7CVu5Fkf-CY8hSDJOz42dN8kBVhhC2mpTDC6YmDSzWa4dASd36ckBGkZxwP-Uw_KQZy1RkNXSdyfqZcrJk5H32RjnbPBS2e2vS3yQzr3gcy2l4i_9qa0HjxKz7rneZcwERvjsu-f54vo', 'Super Admin', 'Active', now()),
  ('f0000001-0000-0000-0000-000000000002', 'Jane Smith', 'jane.smith@herbaladmin.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAytdU6lp_-A9TVq2ZyiezEaEq13-vYHnquGdISMuDx8v15J7vsBYIw4dMlXLyapqIwnkUTMVq2PlXl5WoFJ8OZOnje1fd6P4yPTDc6a87AuFM0keqwaYNM9cA9lnr9iInVFGfcnbc0LIBUuD2coHQvDhReSQvY7-BV--HsTQXFfm1wMwI1KWrD7uFKxVuhvAlMOhd2sX8Ioy89crWZKYbfkFfdI1EZh03O845rCjbK0dyjCMEAmU-YphW-mq-DlOjFyRuy_Zk5I7Y', 'Editor', 'Active', now() - interval '3 hours'),
  ('f0000001-0000-0000-0000-000000000003', 'John Doe', 'john.doe@herbaladmin.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEbFqtHKkdr1zY17c1eEc2clYZJKwpRl2qDWlCHwlMu3urcOZS4IdifAbfyRXKUEu01AdQYPRlJHNQ9ZSY5blv4hyDKZMAalxaxilmKkkYEkGZA69Gud6x8qjQyrPR4TEWlSQFwYt6UICA4K-TZSGudmZ49GTZoGkluiOAGm35WH__XaflxOx5HpXc8yu1kiWWzYH854OtE_LHI9RVpWYkGi_KDYWQdu3-ruDxzdVYFg_wFlEsyuf45R1YUbr2hSC6ZX8jdtm3q0Y', 'Contributor', 'Away', now() - interval '2 days'),
  ('f0000001-0000-0000-0000-000000000004', 'Mike Chen', 'mike.chen@herbaladmin.com', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbsMVgQTdCyI_Ui51ywO1-ZXeBidOMk1sWgKv249tEybkq5zwR1_CWa01CPRgUu5OlOMQxofEljMFjW03grq8KMd1FrwBtp3IxaYvb0HHM45NFje_zn1DqnbdKi74qZnEHBKk_W3ah-ElhHsK0-D9-AXYrWTw-l51Jy6MdAS1M9p5y_dp39JBM6uiDXrBE_zV_WD2craREr-ftrC_u8b4JEbNzOXb5qc0PebtSLcL2AF8vLa6LL7Yx-FNb3Cw6PYrWFlCNlQdipFc', 'Editor', 'Inactive', now() - interval '7 days'),
  ('f0000001-0000-0000-0000-000000000005', 'Sarah Lee', 'sarah.lee@herbaladmin.com', NULL, 'Viewer', 'Pending Invite', NULL);

-- ── Activity Log ──
INSERT INTO activity_log (user_id, action, target_name, target_type, icon) VALUES
  ('f0000001-0000-0000-0000-000000000003', 'added', 'Peppermint Oil', 'Remedies', 'add_circle'),
  (NULL, 'System Backup completed successfully.', NULL, NULL, 'check_circle'),
  ('f0000001-0000-0000-0000-000000000002', 'edited', 'Gingivitis', 'description', 'edit'),
  ('f0000001-0000-0000-0000-000000000004', 'reported a bug in search module.', NULL, NULL, 'bug_report');

-- ── Site Settings ──
INSERT INTO site_settings (site_name, tagline, support_email, phone, address, currency, timezone) VALUES
  ('HerbalWisdom', 'Ancient Remedies, Modern Wellness', 'support@herbalwisdom.com', '+1 (555) 123-4567', '123 Botanical Lane, Portland, OR 97201', 'USD', 'America/Los_Angeles');
