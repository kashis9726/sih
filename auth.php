<?php if (isset($_SESSION['username'])): ?>
    <h2>Welcome, <?php echo $_SESSION['username']; ?>!</h2>
    <a href="?logout=true">Logout</a>

<?php else: ?>
    <h2>Register</h2>
    <?php if (isset($success)) echo "<p style='color:green;'>$success</p>"; ?>
    <?php if (isset($error)) echo "<p style='color:red;'>$error</p>"; ?>
    <form action="" method="POST">
        <label>Username:</label>
        <input type="text" name="username" required>
        <br>
        <label>Password:</label>
        <input type="password" name="password" required>
        <br>
        <button type="submit" name="register">Register</button>
    </form>

    <h2>Login</h2>
    <form action="" method="POST">
        <label>Username:</label>
        <input type="text" name="username" required>
        <br>
        <label>Password:</label>
        <input type="password" name="password" required>
        <br>
        <button type="submit" name="login">Login</button>
    </form>
<?php endif; ?>
