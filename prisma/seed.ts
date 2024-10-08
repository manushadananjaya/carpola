const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function deleteAllData() {
  // Delete from child tables first
  await prisma.promotedItem.deleteMany({});
  await prisma.featuredItem.deleteMany({});

  // Delete Bikes and Vehicles before Users
  await prisma.bike.deleteMany({});
  await prisma.vehicle.deleteMany({});

  // Finally, delete Users
  await prisma.user.deleteMany({});
}


async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: "JohnDoe",
      userEmail: "johndoe@example.com",
      userPhone: "1234567890",
      userCity: "Colombo",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "JaneSmith",
      userEmail: "janesmith@example.com",
      userPhone: "0987654321",
      userCity: "Kandy",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "MichaelBrown",
      userEmail: "michaelbrown@example.com",
      userPhone: "1122334455",
      userCity: "Galle",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      username: "EmilyWhite",
      userEmail: "emilywhite@example.com",
      userPhone: "5566778899",
      userCity: "Jaffna",
    },
  });

  // Create Vehicles with image URLs
  const vehicle1 = await prisma.vehicle.create({
    data: {
      contactNo: "1234567890",
      price: 15000,
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      mileage: 30000,
      gear: "AUTOMATIC",
      fuelType: "PETROL",
      engine: "1.8L",
      details: "Well-maintained Toyota Corolla, only 30k miles",
      posted: true,
      userId: user1.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+5",
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      contactNo: "0987654321",
      price: 20000,
      brand: "Honda",
      model: "Civic",
      year: 2018,
      mileage: 50000,
      gear: "MANUAL",
      fuelType: "DIESEL",
      engine: "2.0L",
      details: "Honda Civic in great condition",
      posted: true,
      userId: user2.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+5",
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      contactNo: "1122334455",
      price: 17000,
      brand: "Mazda",
      model: "CX-5",
      year: 2019,
      mileage: 40000,
      gear: "AUTOMATIC",
      fuelType: "PETROL",
      engine: "2.5L",
      details: "Mazda CX-5 in excellent condition",
      posted: true,
      userId: user3.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Mazda+CX-5+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Mazda+CX-5+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Mazda+CX-5+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Mazda+CX-5+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Mazda+CX-5+5",
    },
  });

  const vehicle4 = await prisma.vehicle.create({
    data: {
      contactNo: "5566778899",
      price: 22000,
      brand: "BMW",
      model: "3 Series",
      year: 2021,
      mileage: 20000,
      gear: "AUTOMATIC",
      fuelType: "PETROL",
      engine: "3.0L",
      details: "Luxury BMW 3 Series, low mileage",
      posted: true,
      userId: user4.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=BMW+3+Series+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=BMW+3+Series+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=BMW+3+Series+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=BMW+3+Series+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=BMW+3+Series+5",
    },
  });

  const vehicle5 = await prisma.vehicle.create({
    data: {
      contactNo: "1122334455",
      price: 25000,
      brand: "Audi",
      model: "A4",
      year: 2020,
      mileage: 25000,
      gear: "AUTOMATIC",
      fuelType: "PETROL",
      engine: "2.0L",
      details: "Audi A4, premium sedan with low mileage",
      posted: true,
      userId: user3.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Audi+A4+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Audi+A4+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Audi+A4+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Audi+A4+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Audi+A4+5",
    },
  });

  // Create Bikes with image URLs
  const bike1 = await prisma.bike.create({
    data: {
      contactNo: "1234567890",
      price: 5000,
      brand: "Yamaha",
      model: "FZ",
      year: 2021,
      mileage: 10000,
      startType: "ELECTRIC",
      bikeType: "FUEL",
      engine: "150cc",
      details: "Yamaha FZ with 10k miles, great condition",
      posted: true,
      userId: user1.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+5",
    },
  });

  const bike2 = await prisma.bike.create({
    data: {
      contactNo: "0987654321",
      price: 4500,
      brand: "Suzuki",
      model: "Gixxer",
      year: 2019,
      mileage: 15000,
      startType: "KICK",
      bikeType: "FUEL",
      engine: "155cc",
      details: "Suzuki Gixxer with 15k miles",
      posted: true,
      userId: user2.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+5",
    },
  });

  const bike3 = await prisma.bike.create({
    data: {
      contactNo: "1122334455",
      price: 6000,
      brand: "Honda",
      model: "CBR 150R",
      year: 2020,
      mileage: 8000,
      startType: "ELECTRIC",
      bikeType: "FUEL",
      engine: "150cc",
      details: "Honda CBR 150R in mint condition",
      posted: true,
      userId: user3.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Honda+CBR+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Honda+CBR+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Honda+CBR+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Honda+CBR+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Honda+CBR+5",
    },
  });

  const bike4 = await prisma.bike.create({
    data: {
      contactNo: "5566778899",
      price: 5500,
      brand: "Kawasaki",
      model: "Ninja 250",
      year: 2021,
      mileage: 5000,
      startType: "ELECTRIC",
      bikeType: "FUEL",
      engine: "250cc",
      details: "Kawasaki Ninja 250, very low mileage",
      posted: true,
      userId: user4.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Kawasaki+Ninja+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Kawasaki+Ninja+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Kawasaki+Ninja+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Kawasaki+Ninja+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Kawasaki+Ninja+5",
    },
  });

  const bike5 = await prisma.bike.create({
    data: {
      contactNo: "1122334455",
      price: 4800,
      brand: "Bajaj",
      model: "Pulsar 200",
      year: 2018,
      mileage: 12000,
      startType: "KICK",
      bikeType: "FUEL",
      engine: "200cc",
      details: "Bajaj Pulsar 200, well-maintained",
      posted: true,
      userId: user3.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Bajaj+Pulsar+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Bajaj+Pulsar+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Bajaj+Pulsar+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Bajaj+Pulsar+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Bajaj+Pulsar+5",
    },
  });

  // Create Promoted Items
  await prisma.promotedItem.create({
    data: {
      vehicleId: vehicle1.vehicleId,
      createdAt: new Date(),
    },
  });

  await prisma.promotedItem.create({
    data: {
      bikeId: bike1.bikeId,
      createdAt: new Date(),
    },
  });

  // Create Featured Items
  await prisma.featuredItem.create({
    data: {
      vehicleId: vehicle2.vehicleId,
      createdAt: new Date(),
    },
  });

  await prisma.featuredItem.create({
    data: {
      bikeId: bike3.bikeId,
      createdAt: new Date(),
    },
  });



  await prisma.featuredItem.create({
    data: {
      vehicleId: vehicle3.vehicleId,
      createdAt: new Date(),
    },
  });

  await prisma.featuredItem.create({
    data: {
      bikeId: bike2.bikeId,
      createdAt: new Date(),
    },
  });
}

main()
  .then(() => console.log("Seed data with image URLs created!"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
