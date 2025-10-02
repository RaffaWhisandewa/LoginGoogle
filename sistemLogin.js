        // GANTI dengan Client ID Anda dari Google Cloud Console
        const CLIENT_ID = '329300608269-3s3b77kqnomjbj1fdtq5mvbndn4faeh2.apps.googleusercontent.com';
        
        let currentUser = null;

        // Parse JWT token
        function parseJwt(token) {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error('Error parsing JWT:', error);
                return null;
            }
        }

        // Handle response dari Google
        function handleCredentialResponse(response) {
            const userObject = parseJwt(response.credential);
            
            if (!userObject) {
                showError('Gagal membaca data pengguna');
                return;
            }
            
            currentUser = {
                email: userObject.email,
                name: userObject.name,
                picture: userObject.picture
            };
            
            showDashboard();
        }

        // Tampilkan dashboard
        function showDashboard() {
            document.getElementById('loginBox').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userEmail').textContent = currentUser.email;
            document.getElementById('profileImg').src = currentUser.picture;
        }

        // Tampilkan error
        function showError(message) {
            const errorDiv = document.getElementById('errorMessage');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        // Initialize Google Sign-In
        window.onload = function() {
            if (typeof google === 'undefined') {
                setTimeout(() => {
                    if (typeof google === 'undefined') {
                        showError('Gagal memuat Google Sign-In. Periksa koneksi internet.');
                        return;
                    }
                    initGoogle();
                }, 2000);
            } else {
                initGoogle();
            }
        };

        function initGoogle() {
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: handleCredentialResponse
            });

            google.accounts.id.renderButton(
                document.getElementById('googleButton'),
                { 
                    theme: 'outline', 
                    size: 'large',
                    width: 300,
                    text: 'signin_with',
                    locale: 'id'
                }
            );
        }

        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', function() {
            currentUser = null;
            document.getElementById('loginBox').style.display = 'block';
            document.getElementById('dashboard').style.display = 'none';
        });
