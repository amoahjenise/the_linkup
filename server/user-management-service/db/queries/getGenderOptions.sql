-- getGenderOptions.sql
-- Returns all available gender options for the application
SELECT ARRAY[
    'Men', 'Women', 'Agender', 'Androgynous', 'Bigender', 
    'Crossdresser', 'Demiboy', 'Demigirl', 'Gender Nonconforming',
    'Gender questioning', 'Genderqueer', 'Genderfluid', 'Gender variant',
    'Intersex', 'Neutrois', 'Non-binary', 'Pangender', 'Transfeminine',
    'Transgender', 'Transmasculine', 'Third gender', 'Two-Spirit'
] AS gender_options;