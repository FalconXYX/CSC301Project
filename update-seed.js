const fs = require('fs');
let content = fs.readFileSync('PhysioFind-Express/scripts/seedDatabase.js', 'utf8');

content = content.replace(`        const clinic = await prisma.clinics.findFirst({ where: { name: "PhysioFind Downtown" } });
        
        const practitioners = [
            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "physiotherapist", bio: "Expert in sports injuries." },
            { user_id: createdUsers[1].id, clinic_id: clinic?.id, profession: "massage_therapist", bio: "Relaxation and recovery." },
            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "chiropractor", bio: "Spinal adjustments." },
            { user_id: createdUsers[1].id, clinic_id: clinic?.id, profession: "osteopath", bio: "Holistic approach." },
            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "acupuncturist", bio: "Traditional Chinese Medicine." },
        ];`, `
        const clinic = await prisma.clinics.findFirsconst fs = require('fs');
letd let content = fs.readFil
 
content = content.replace(`        const clinic = await prisma.clinics.findFirst({: c        
        const practitioners = [
            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "physin       cl            { user_id: created_t            { user_id: createdUsers[1].id, clinic_id: clinic?.id, profession: "massage_therapist", bio: "Relaxation and recovery." }ac            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "chiropractor", bio: "Spinal adjustments." },
        "H            { user_id: createdUsers[1].id, clinic_id: clinic?.id, profession: "osteopath", bio: "Holistic approach." },
  "T            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "acupuncturist", bio: "Traditional Chine          ];`, `
        const clinic = await prisma.clinics.findFirsconst fs = require('fs');
letd let content = fs.readFil
 
content ac        constdUletd let content = fs.readFil
 
content = content.replace(`        const cli
  
content = content.replace(sma.        const practitioners = [
            { user_id: createdUsers[0].id, clinic_id: clinicpr            { user_id: created;
        "H            { user_id: createdUsers[1].id, clinic_id: clinic?.id, profession: "osteopath", bio: "Holistic approach." },
  "T            { user_id: createdUsers[0].id, clinic_id: clinic?.id, profession: "acupuncturist", bio: "Traditional Chine          ];`, `
        const clinic = await prisma.clinics.findFirsconst fs = require('fs');
letd  git checkout PhysioFind-Express/scripts/seedDatabase.js
 EOF
git checkout PhysioFind-Express/scripts/seedDatabase.js
 ^C
 EOF
 npm run db:seed
 cat PhysioFind-Express/package.json
 '
 END_OF_FILE
 EOF
 cat PhysioFind-Express/routes/providers/createProvider.js
 EOF
 grep -rn "createProvider" PhysioFind-FrontEnd/src/
 grep -rn "useGoogleMaps" PhysioFind-FrontEnd/src/
 grep -rn "CreateClinicPayload" PhysioFind-FrontEnd/src/
 cat PhysioFind-FrontEnd/src/stores/providerSearch.ts
 EOF
 ^C
 '
"
