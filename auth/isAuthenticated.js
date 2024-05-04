function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // Redirect to Google auth if not authenticated
    res.redirect('/auth/google');
}

exports.isAuthenticated = isAuthenticated;