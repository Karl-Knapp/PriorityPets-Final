import User from "../models/user";
import Pet from "../models/pet";
import Task from "../models/task";

// Function to be executed once every 24 hours
async function processUsers() {
  try {
    // Get all users with a current pet that is not null
    const users = await User.find({
      $and: [{ "pets.currentPet": { $ne: undefined } }, { "pets.currentPet": { $ne: null } }],
    });
    const currentDate = new Date();
    for (const user of users) {
      // Skip the user if currentPet is null
      if (user.pets.currentPet === null) {
        continue;
      }
      const currentPet = await Pet.findById(user.pets.currentPet);
      for (const taskId of user.tasks) {
        const task = await Task.findById(taskId);
        // Check if the task due date is before the current date
        if (task.dueDate < currentDate) {
          const lowestTime = currentPet.lastTimeDamaged < task.dueDate ? currentPet.lastTimeDamaged : task.dueDate;
          // Calculate the time difference in hours
          const timeDifference = Math.abs(currentDate - lowestTime) / 36e5;
          // Reduce pet's health by 1 per hour
          const healthReduction = Math.floor(timeDifference);
          // Ensure the pet's health doesn't go below 0
          currentPet.healthLevel -= healthReduction;
          currentPet.healthLevel = Math.max(currentPet.healthLevel, 0);
          currentPet.lastTimeDamaged = currentDate;
        }
      }
      // Save the updated pet if currentPet is not null
      if (currentPet) {
        try {
          await currentPet.save();
        } catch (error) {
          console.error("Error occurred during save:", error);
        }
      }
    }
    console.log("Processing completed successfully!");
  } catch (error) {
    console.error("Error occurred during processing:", error);
  }
}
export default processUsers;
