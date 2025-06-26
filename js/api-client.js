// api-client.js - API communication with authentication
class PeapodAPI {
    // For now, we'll use mock data. Later replace with your Salesforce endpoints
    static BASE_URL = 'https://your-salesforce-instance.com/services/apexrest';
    
    // Mock user database for demo (replace with real Salesforce integration)
    static DEMO_USERS = {
        'demo@peapodfinance.com': {
            password: 'demo123',
            userId: 'user_123',
            name: 'John Doe',
            businessName: 'ABC Manufacturing Corp',
            email: 'demo@peapodfinance.com',
            phone: '(555) 123-4567',
            title: 'CEO & Founder',
            industry: 'Manufacturing',
            founded: 'March 2020',
            employees: '25-50'
        },
        'jane.smith@techstartup.com': {
            password: 'password123',
            userId: 'user_456',
            name: 'Jane Smith',
            businessName: 'Tech Innovations LLC',
            email: 'jane.smith@techstartup.com',
            phone: '(555) 987-6543',
            title: 'Founder & CTO',
            industry: 'Technology',
            founded: 'January 2022',
            employees: '10-25'
        }
    };
    
    static async makeAuthenticatedRequest(endpoint, options = {}) {
        const token = SessionManager.getAuthToken();
        
        if (!token) {
            SessionManager.redirectToLogin();
            throw new Error('No authentication token');
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock response based on endpoint
        return this.mockAPIResponse(endpoint, options);
    }
    
    // Mock API responses (replace with real Salesforce calls)
    static mockAPIResponse(endpoint, options) {
        const user = SessionManager.getCurrentUser();
        
        switch (endpoint) {
            case '/api/user/profile':
                return {
                    success: true,
                    data: user
                };
                
            case '/api/user/documents':
                return {
                    success: true,
                    data: [
                        {
                            id: 'doc_1',
                            name: 'Bank Statements',
                            type: 'PDF',
                            size: '2.4 MB',
                            uploadDate: '2025-01-15',
                            category: 'personal'
                        },
                        {
                            id: 'doc_2',
                            name: 'Tax Returns',
                            type: 'PDF',
                            size: '1.8 MB',
                            uploadDate: '2025-01-10',
                            category: 'personal'
                        },
                        {
                            id: 'doc_3',
                            name: 'Business License',
                            type: 'PDF',
                            size: '0.5 MB',
                            uploadDate: '2025-01-05',
                            category: 'business'
                        }
                    ]
                };
                
            case '/api/user/payments/summary':
                return {
                    success: true,
                    data: {
                        totalBalance: 47650,
                        totalPaid: 77350,
                        nextPayment: 2485,
                        nextPaymentDate: '2025-02-15',
                        activeLoans: 2
                    }
                };
                
            case '/api/user/payments':
                return {
                    success: true,
                    data: [
                        {
                            id: 'pay_1',
                            date: '2025-01-15',
                            amount: 2485,
                            lender: 'Capital Growth Partners',
                            method: 'ACH Transfer',
                            status: 'completed'
                        },
                        {
                            id: 'pay_2',
                            date: '2024-12-15',
                            amount: 2485,
                            lender: 'Capital Growth Partners',
                            method: 'ACH Transfer',
                            status: 'completed'
                        },
                        {
                            id: 'pay_3',
                            date: '2024-11-15',
                            amount: 1850,
                            lender: 'Swift Capital Solutions',
                            method: 'ACH Transfer',
                            status: 'completed'
                        }
                    ]
                };
                
            case '/api/user/applications':
                return {
                    success: true,
                    data: [
                        {
                            id: 'app_1',
                            applicationId: '#APP-2025-001',
                            amount: 75000,
                            dateSubmitted: '2025-01-05',
                            lender: 'Capital Growth Partners',
                            status: 'funded'
                        },
                        {
                            id: 'app_2',
                            applicationId: '#APP-2024-003',
                            amount: 50000,
                            dateSubmitted: '2024-11-15',
                            lender: 'Swift Capital Solutions',
                            status: 'completed'
                        }
                    ]
                };
                
            default:
                return { success: false, message: 'Endpoint not found' };
        }
    }
    
    // Authentication endpoints
    static async login(email, password) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check demo users
        const user = this.DEMO_USERS[email.toLowerCase()];
        
        if (!user || user.password !== password) {
            throw new Error('Invalid email or password');
        }
        
        // Generate mock JWT token
        const token = `mock_jwt_token_${Date.now()}`;
        
        return {
            success: true,
            user: {
                id: user.userId,
                email: user.email,
                name: user.name,
                businessName: user.businessName,
                phone: user.phone,
                title: user.title,
                industry: user.industry,
                founded: user.founded,
                employees: user.employees
            },
            token: token
            static async register(userData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Basic validation
    if (this.DEMO_USERS[userData.email.toLowerCase()]) {
        throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser = {
        userId: `user_${Date.now()}`,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        businessName: userData.businessName,
        phone: userData.phone,
        industry: userData.industry,
        website: userData.businessWebsite || '',
        title: 'Business Owner'
    };
    
    // Add to demo users
    this.DEMO_USERS[userData.email.toLowerCase()] = {
        password: userData.password,
        ...newUser
    };
    
    // Generate token
    const token = `mock_jwt_token_${Date.now()}`;
    
    return {
        success: true,
        user: newUser,
        token: token
    };
}
        };
    }
    
    static async refreshToken() {
        return await this.makeAuthenticatedRequest('/api/auth/refresh', {
            method: 'POST'
        });
    }
    
    // Profile endpoints
    static async getUserProfile() {
        return await this.makeAuthenticatedRequest('/api/user/profile');
    }
    
    static async updateUserProfile(profileData) {
        return await this.makeAuthenticatedRequest('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
    
    // Document endpoints
    static async getUserDocuments() {
        return await this.makeAuthenticatedRequest('/api/user/documents');
    }
    
    static async uploadDocument(file, category = 'personal') {
        // Mock file upload
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        return {
            success: true,
            data: {
                id: `doc_${Date.now()}`,
                name: file.name,
                type: file.type,
                size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                uploadDate: new Date().toISOString().split('T')[0],
                category: category
            }
        };
    }
    
    // Payment endpoints
    static async getPaymentHistory() {
        return await this.makeAuthenticatedRequest('/api/user/payments');
    }
    
    static async getPaymentSummary() {
        return await this.makeAuthenticatedRequest('/api/user/payments/summary');
    }
    
    // Application endpoints
    static async getUserApplications() {
        return await this.makeAuthenticatedRequest('/api/user/applications');
    }
    
    static async submitApplication(applicationData) {
        return await this.makeAuthenticatedRequest('/api/applications', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    }
}
