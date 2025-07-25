import { createInterface } from "node:readline";
import fs from "node:fs";

let addPets = [];
let petId = 1;

// Create readline interface
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}
function mainMenu() {
  console.log("=============================");
  console.log(" Pet Adoption Center Manager");
  console.log("=============================");
  console.log("1. Add new pet");
  console.log("2. View all pets");
  console.log("3. Update pet information");
  console.log("4. Remove pet");
  console.log("5. Exit");
  console.log("=============================");
}

async function main() {
  saveData();
  mainMenu();
  while (true) {
    let choice = await ask("\n Select an option (1-5): ");
    switch (choice) {
      case "1":
        await addPet();
        break;
      case "2":
        await viewAllPet();
        break;
      case "3":
        await petIdToUpdate();
        break;
      case "4":
        await removePet();
        break;
      case "5":
        console.log("Goodbye!");
        process.exit();

      default:
        console.log("Invalid option. Please enter a number between 1 and 5.");
    }
  }
}

async function addPet() {
  let petName = await ask("Pet's name: ");
  let petSpecies = await ask("Pet's species: ");
  let petBread = await ask("Pet's bread: ");
  let petAge = await ask("Pet's age: ");
  let petStatus = await ask("Pet's Available / Adopted / Removed (1/2/3): ");

  if (petStatus == 1) {
    petStatus = "Available";
  } else if (petStatus == 2) {
    petStatus = "Adopted";
  } else if (petStatus == 3) {
    petStatus = "Removed";
  } else {
    console.log("Enter valid number: ");
    return;
  }

  addPets.push({
    id: petId++,
    petName,
    petSpecies,
    petBread,
    petAge,
    petStatus,
  });

  console.log(addPets);
  main();
}

async function viewAllPet() {
  console.log("View All Pets");
  console.log("\nID\tNAME\tSPECIES\tBREAD\tAGE\tSTATUS");
  console.log("---------------------------------------------------");
  addPets.forEach((p) => {
    console.log(
      `${p.id}\t${p.petName}\t${p.petSpecies}\t${p.petBread}\t${p.petAge}\t${p.petStatus}`
    );
  });
  main();
}
async function petIdToUpdate() {
  let updatePet = await ask("\n Enter petId to update pet: ");
  let updateId = addPets.find((f) => f.id == updatePet);
  if (!updateId) {
    console.log(`Pet with ID ${updatePet} not found.`);
    petIdToUpdate();
    return;
  }
  updateId.petName = await ask("Enter new pet name: ");
  console.log("Updated:", updateId);
  main();
}
async function removePet() {
  let updatePet = await ask("\n Enter petId to delete pet: ");
  let updateId = addPets.find((f) => f.id == updatePet);
  if (!updateId) {
    console.log(`Pet with ID ${updatePet} not found.`);
    updatePet;
    return;
  }
  const index = addPets.indexOf(updateId);
  if (index !== -1) {
    addPets.splice(index, 1);
    console.log("Delete:", updateId);
  }
  main();
}

function saveData() {
  let data = "";
  addPets.forEach((item) => {
    data += `\n${item.id} | ${item.petName} | ${item.petSpecies} | ${item.petBread} | ${item.petAge} | ${item.petStatus}`;
  });
  fs.writeFileSync("pets.txt", data, (err) => {
    if (err) console.log(err);
    console.log("successfully saved data!");
  });
}

main();
