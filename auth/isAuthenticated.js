function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect to the sign-in page if not authenticated
    res.redirect('/login');
}

exports.isAuthenticated = isAuthenticated;