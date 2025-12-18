const names = ["Sunil", "Priya", "Amit", "Neha", "Rahul"];


let left = 0;
let right = names.length - 1;


while (left < right) {
    let temp = names[left];
    names[left] = names[right];
    names[right] = temp;
    left++;
    right--;
}


console.log(names);





