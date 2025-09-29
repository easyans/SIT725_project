// FIXED: Show payment page function
function showPaymentPage() {
    console.log('💰 START: Showing payment page');
    
    // Get elements
    const loginPage = document.getElementById('loginPage');
    const paymentPage = document.getElementById('paymentPage');
    
    if (!loginPage || !paymentPage) {
        console.error('❌ CRITICAL: Login or Payment page elements not found!');
        return;
    }
    
    // Show/hide pages
    loginPage.style.display = 'none';
    paymentPage.style.display = 'block';
    console.log('✅ Pages switched');

    // Get user data
    const user = auth.getCurrentUser();
    console.log('👤 User data retrieved:', user);
    
    if (!user) {
        console.error('❌ USER DATA NOT FOUND - Debug info:');
        console.log('   deakinpay_loggedIn:', localStorage.getItem('deakinpay_loggedIn'));
        console.log('   deakinpay_userData:', localStorage.getItem('deakinpay_userData'));
        console.log('   deakinpay_userEmail:', localStorage.getItem('deakinpay_userEmail'));
        
        // Try to fix by reloading from server
        const userEmail = localStorage.getItem('deakinpay_userEmail');
        if (userEmail) {
            console.log('🔄 Attempting to reload user data for:', userEmail);
            // This would require additional API endpoint
        }
        
        alert('User data not found. Please login again.');
        auth.logout();
        loginPage.style.display = 'flex';
        paymentPage.style.display = 'none';
        return;
    }

    // ✅ SET USER DATA
    try {
        console.log('🎯 Setting user data in UI...');
        
        // Basic user info
        const elements = {
            'loggedInUser': `${user.name} (${user.student_id || user.id})`,
            'studentName': user.name,
            'studentId': user.student_id || user.id,
            'studentCourse': user.course,
            'studentSemester': user.semester,
            'studentStatus': user.status,
            'receiptEmail': user.email
        };
        
        for (const [id, value] of Object.entries(elements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
                console.log(`   ✅ Set ${id}: ${value}`);
            } else {
                console.log(`   ❌ Element ${id} not found`);
            }
        }

        // ✅ ADD ENROLLED UNITS
        const unitsContainer = document.getElementById('enrolledUnits');
        if (unitsContainer) {
            unitsContainer.innerHTML = '';
            if (user.units && user.units.length > 0) {
                user.units.forEach(unit => {
                    const badge = document.createElement('span');
                    badge.className = 'unit-badge';
                    badge.innerHTML = `<i class="fas fa-book"></i> ${unit}`;
                    unitsContainer.appendChild(badge);
                });
                console.log(`   ✅ Added ${user.units.length} units`);
            } else {
                unitsContainer.innerHTML = '<span class="text-muted">No units enrolled</span>';
                console.log('   ℹ️ No units to display');
            }
        }

        // ✅ ADD FEES TO TABLE
        const feeTableBody = document.getElementById('feeTableBody');
        if (feeTableBody) {
            feeTableBody.innerHTML = '';
            let total = 0;
            
            if (user.fees && user.fees.length > 0) {
                user.fees.forEach(fee => {
                    total += fee.amount || 0;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="small">${fee.description || 'No Description'}</td>
                        <td class="small">${fee.dueDate || 'No Date'}</td>
                        <td class="small">$${(fee.amount || 0).toFixed(2)}</td>
                        <td><span class="badge bg-warning text-dark small">${fee.status || 'Pending'}</span></td>
                    `;
                    feeTableBody.appendChild(row);
                });
                console.log(`   ✅ Added ${user.fees.length} fees, total: $${total.toFixed(2)}`);
            } else {
                feeTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center text-muted py-4">
                            <i class="fas fa-info-circle me-2"></i>No fees due at this time
                        </td>
                    </tr>
                `;
                console.log('   ℹ️ No fees to display');
            }

            // ✅ SET TOTALS
            const totalElements = {
                'totalPayable': `$${total.toFixed(2)}`,
                'paymentTotal': `$${total.toFixed(2)}`,
                'successAmount': `$${total.toFixed(2)}`,
                'verificationAmount': `$${total.toFixed(2)}`
            };
            
            for (const [id, value] of Object.entries(totalElements)) {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value;
                }
            }
            
            // Set due date
            const dueDateElement = document.getElementById('dueDate');
            if (dueDateElement) {
                dueDateElement.textContent = user.fees && user.fees.length > 0 ? user.fees[0].dueDate : 'No due date';
            }
        }

        console.log('🎉 PAYMENT PAGE SETUP COMPLETE');
        
    } catch (error) {
        console.error('💥 Error in showPaymentPage:', error);
        alert('Error loading payment page. Check console.');
    }
}