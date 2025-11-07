<?php
$host = "localhost";
$user = "root";   // your MySQL username
$pass = "";       // your MySQL password
$db   = "registration_db";

// Connect
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Handle Delete
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $conn->query("DELETE FROM users WHERE id=$id");
    header("Location: registration.php");
    exit;
}

// Handle Insert
if (isset($_POST['register'])) {
    $name = $_POST['name'];
    $dob = $_POST['dob'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $address = $_POST['address'];
    $state = $_POST['state'];
    $education = isset($_POST['education']) ? implode(",", (array)$_POST['education']) : "";

    // Upload image
    $targetDir = "uploads/";
    if (!is_dir($targetDir)) mkdir($targetDir);
    $profileImage = $targetDir . basename($_FILES["profileImage"]["name"]);
    move_uploaded_file($_FILES["profileImage"]["tmp_name"], $profileImage);

    $sql = "INSERT INTO users (name, dob, gender, email, mobile, address, state, education, profileImage) 
            VALUES ('$name','$dob','$gender','$email','$mobile','$address','$state','$education','$profileImage')";
    $conn->query($sql);
    header("Location: registration.php");
    exit;
}

// Handle Update
if (isset($_POST['update'])) {
    $id = $_POST['id'];
    $name = $_POST['name'];
    $dob = $_POST['dob'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $mobile = $_POST['mobile'];
    $address = $_POST['address'];
    $state = $_POST['state'];
    $education = $_POST['education'];

    $sql = "UPDATE users SET 
            name='$name', dob='$dob', gender='$gender', email='$email',
            mobile='$mobile', address='$address', state='$state', education='$education'
            WHERE id=$id";
    $conn->query($sql);
    header("Location: registration.php");
    exit;
}

// Fetch records
$result = $conn->query("SELECT * FROM users");
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Registration</title>
    <style>
        table, th, td { border:1px solid black; border-collapse:collapse; padding:8px; }
        img { width:50px; height:50px; }
    </style>
</head>
<body>

<h2>User Registration Form</h2>
<form method="post" enctype="multipart/form-data">
    <label>Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>DOB:</label><br>
    <input type="date" name="dob" required><br><br>

    <label>Gender:</label><br>
    <input type="radio" name="gender" value="male" required> Male
    <input type="radio" name="gender" value="female" required> Female<br><br>

    <label>Email:</label><br>
    <input type="email" name="email" required><br><br>

    <label>Mobile:</label><br>
    <input type="text" name="mobile" pattern="[0-9]{10}" required><br><br>

    <label>Address:</label><br>
    <textarea name="address" required></textarea><br><br>

    <label>State:</label><br>
    <select name="state" required>
        <option value="">Select</option>
        <option value="State1">State1</option>
        <option value="State2">State2</option>
        <option value="State3">State3</option>
    </select><br><br>

    <label>Education:</label><br>
    <input type="checkbox" name="education[]" value="High School"> High School
    <input type="checkbox" name="education[]" value="Bachelors"> Bachelors
    <input type="checkbox" name="education[]" value="Masters"> Masters<br><br>

    <label>Profile Image:</label><br>
    <input type="file" name="profileImage" required><br><br>

    <button type="submit" name="register">Register</button>
    <button type="reset">Reset</button>
</form>

<hr>
<h2>Registered Users</h2>
<table>
<tr>
    <th>ID</th><th>Name</th><th>DOB</th><th>Gender</th><th>Email</th><th>Mobile</th>
    <th>Address</th><th>State</th><th>Education</th><th>Profile</th><th>Action</th>
</tr>
<?php while($row = $result->fetch_assoc()) { ?>
<tr>
    <form method="post">
        <td><?= $row['id'] ?><input type="hidden" name="id" value="<?= $row['id'] ?>"></td>
        <td><input type="text" name="name" value="<?= $row['name'] ?>"></td>
        <td><input type="date" name="dob" value="<?= $row['dob'] ?>"></td>
        <td>
            <input type="radio" name="gender" value="male" <?= $row['gender']=="male"?"checked":"" ?>>M 
            <input type="radio" name="gender" value="female" <?= $row['gender']=="female"?"checked":"" ?>>F
        </td>
        <td><input type="email" name="email" value="<?= $row['email'] ?>"></td>
        <td><input type="text" name="mobile" value="<?= $row['mobile'] ?>"></td>
        <td><input type="text" name="address" value="<?= $row['address'] ?>"></td>
        <td><input type="text" name="state" value="<?= $row['state'] ?>"></td>
        <td><input type="text" name="education" value="<?= $row['education'] ?>"></td>
        <td><img src="<?= $row['profileImage'] ?>"></td>
        <td>
            <button type="submit" name="update">Update</button>
            <a href="registration.php?delete=<?= $row['id'] ?>" onclick="return confirm('Delete this record?')">Delete</a>
        </td>
    </form>
</tr>
<?php } ?>
</table>

</body>
</html>
