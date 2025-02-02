// Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to the target.
// Example:
// Input:
// Output: [0, 1]

function twoSum(nums, target) {
  let map = new Map();
  let result = [];

  for (let i = 0; i < nums.length; i++) {
    let diff = target - nums[i];

    // id difference is preent6

    if (map.has(diff)) {
      result.push([map.get(diff), i]);
    }

    map.set(nums[i], i);
  }

  return result.length > 0 ? result : null;
}

(nums = [2, 7, 11, 15]), (target = 17);
console.log(twoSum(nums, target));
