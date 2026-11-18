/**
 * DEMOSMAK TUTORIAL - Payment Engine & Paystack Simulation
 * Realistic online payment processing with automatic verification and digital receipts.
 * Strictly NO EMOJIS.
 */

class PaymentEngine {
    constructor() {
        this.activePayment = null;
    }

    initPaystackModal(params) {
        // params: { studentId, studentName, email, amount, description, onSuccess, onCancel }
        this.activePayment = params;

        let modal = document.getElementById('paystack-modal-container');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'paystack-modal-container';
            modal.className = 'pstk-modal-backdrop';
            document.body.appendChild(modal);
        }

        const formattedAmount = Number(params.amount).toLocaleString();

        modal.innerHTML = `
            <div class="pstk-modal-dialog">
                <div class="pstk-header">
                    <div class="pstk-brand">
                        <div class="pstk-logo-badge">P</div>
                        <div>
                            <div class="pstk-brand-name">DEMOSMAK TUTORIAL</div>
                            <div class="pstk-secured">Secured by Paystack</div>
                        </div>
                    </div>
                    <button type="button" class="pstk-close-btn" id="pstk-close-btn" aria-label="Close Payment Modal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="pstk-body">
                    <div class="pstk-amount-bar">
                        <span class="pstk-amount-label">${params.description || 'Tuition Fee Payment'}</span>
                        <span class="pstk-amount-value">NGN ${formattedAmount}</span>
                    </div>

                    <div class="pstk-payer-info">
                        <span>Payer: <strong>${params.studentName || 'Student'}</strong> (${params.email || 'guardian@demosmak.edu.ng'})</span>
                    </div>

                    <div class="pstk-channel-tabs">
                        <button type="button" class="pstk-tab-btn active" data-channel="card">Card</button>
                        <button type="button" class="pstk-tab-btn" data-channel="transfer">Bank Transfer</button>
                        <button type="button" class="pstk-tab-btn" data-channel="ussd">USSD</button>
                    </div>

                    <div id="pstk-tab-card" class="pstk-tab-content active">
                        <form id="pstk-card-form" onsubmit="return false;">
                            <div class="pstk-form-group">
                                <label>CARD NUMBER</label>
                                <input type="text" id="pstk-card-number" placeholder="4084 0800 0000 0000" maxlength="19" value="4084 1234 5678 9010" required />
                            </div>
                            <div class="pstk-form-row">
                                <div class="pstk-form-group">
                                    <label>CARD EXPIRY</label>
                                    <input type="text" id="pstk-card-expiry" placeholder="MM / YY" maxlength="5" value="08/28" required />
                                </div>
                                <div class="pstk-form-group">
                                    <label>CVV</label>
                                    <input type="password" id="pstk-card-cvv" placeholder="123" maxlength="3" value="456" required />
                                </div>
                            </div>
                            <button type="button" class="pstk-pay-btn" id="pstk-submit-card-btn">
                                Pay NGN ${formattedAmount}
                            </button>
                        </form>
                    </div>

                    <div id="pstk-tab-transfer" class="pstk-tab-content">
                        <div class="pstk-transfer-box">
                            <p class="pstk-transfer-hint">Transfer exactly <strong>NGN ${formattedAmount}</strong> to the dedicated Demosmak account below:</p>
                            <div class="pstk-bank-detail">
                                <div class="pstk-bank-row"><span class="label">Bank Name:</span> <span class="val">Titan Trust Bank / Paystack</span></div>
                                <div class="pstk-bank-row"><span class="label">Account Number:</span> <span class="val copyable">9920148291</span></div>
                                <div class="pstk-bank-row"><span class="label">Beneficiary:</span> <span class="val">Demosmak Tutorial / Chidinma</span></div>
                            </div>
                            <button type="button" class="pstk-pay-btn" id="pstk-submit-transfer-btn">
                                I Have Sent The Money
                            </button>
                        </div>
                    </div>

                    <div id="pstk-tab-ussd" class="pstk-tab-content">
                        <div class="pstk-transfer-box">
                            <p class="pstk-transfer-hint">Dial the following USSD code on your registered mobile banking line:</p>
                            <div class="pstk-ussd-code">*737*50*${params.amount}*192#</div>
                            <button type="button" class="pstk-pay-btn" id="pstk-submit-ussd-btn">
                                Verify USSD Payment
                            </button>
                        </div>
                    </div>

                    <div id="pstk-processing-screen" class="pstk-processing-screen" style="display: none;">
                        <div class="pstk-spinner"></div>
                        <h4 id="pstk-process-title">Verifying Transaction...</h4>
                        <p id="pstk-process-subtitle">Connecting to Paystack banking network. Please do not close this window.</p>
                    </div>

                    <div id="pstk-success-screen" class="pstk-success-screen" style="display: none;">
                        <div class="pstk-success-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <h4>Payment Verified Successfully</h4>
                        <p class="pstk-ref-badge" id="pstk-success-ref">REF: PSTK-DEMO-982341</p>
                        <p>Tuition record has been updated and digital receipt issued.</p>
                        <button type="button" class="pstk-receipt-btn" id="pstk-view-receipt-btn">
                            View Official Digital Receipt
                        </button>
                    </div>
                </div>

                <div class="pstk-footer">
                    <span>Paystack Test Environment &bull; 256-Bit SSL Encryption</span>
                </div>
            </div>
        `;

        modal.classList.add('visible');

        // Event Listeners
        const closeBtn = document.getElementById('pstk-close-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                this.closePaystackModal();
                if (params.onCancel) params.onCancel();
            };
        }

        // Tab Switching
        const tabs = modal.querySelectorAll('.pstk-tab-btn');
        tabs.forEach(tab => {
            tab.onclick = () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const target = tab.dataset.channel;
                modal.querySelectorAll('.pstk-tab-content').forEach(c => c.classList.remove('active'));
                const targetContent = document.getElementById(`pstk-tab-${target}`);
                if (targetContent) targetContent.classList.add('active');
            };
        });

        // Pay Actions
        const doPayment = (channelName) => {
            this.simulateProcessing(channelName, params);
        };

        const cardBtn = document.getElementById('pstk-submit-card-btn');
        if (cardBtn) cardBtn.onclick = () => doPayment('Paystack Card');

        const transferBtn = document.getElementById('pstk-submit-transfer-btn');
        if (transferBtn) transferBtn.onclick = () => doPayment('Bank Transfer');

        const ussdBtn = document.getElementById('pstk-submit-ussd-btn');
        if (ussdBtn) ussdBtn.onclick = () => doPayment('USSD Payment');
    }

    simulateProcessing(channelName, params) {
        const procScreen = document.getElementById('pstk-processing-screen');
        const cardTab = document.getElementById('pstk-tab-card');
        const transferTab = document.getElementById('pstk-tab-transfer');
        const ussdTab = document.getElementById('pstk-tab-ussd');
        const tabBtns = document.querySelector('.pstk-channel-tabs');

        if (cardTab) cardTab.style.display = 'none';
        if (transferTab) transferTab.style.display = 'none';
        if (ussdTab) ussdTab.style.display = 'none';
        if (tabBtns) tabBtns.style.display = 'none';
        if (procScreen) procScreen.style.display = 'flex';

        setTimeout(() => {
            const ref = `PSTK-DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
            const result = window.demosmakDB.recordPayment(params.studentId, {
                amount: params.amount,
                description: params.description || 'Tuition Fee Payment',
                channel: channelName,
                ref: ref
            });

            if (procScreen) procScreen.style.display = 'none';
            const succScreen = document.getElementById('pstk-success-screen');
            if (succScreen) {
                succScreen.style.display = 'flex';
                document.getElementById('pstk-success-ref').textContent = `REF: ${ref}`;
                
                const receiptBtn = document.getElementById('pstk-view-receipt-btn');
                if (receiptBtn) {
                    receiptBtn.onclick = () => {
                        this.closePaystackModal();
                        if (result && result.record) {
                            this.showDigitalReceipt(result.record, result.student);
                        }
                        if (params.onSuccess) params.onSuccess(result);
                    };
                }
            }

            // Global event notification
            window.dispatchEvent(new CustomEvent('paymentCompleted', { detail: result }));
        }, 1800);
    }

    closePaystackModal() {
        const modal = document.getElementById('paystack-modal-container');
        if (modal) {
            modal.classList.remove('visible');
            modal.innerHTML = '';
        }
    }

    showDigitalReceipt(record, student) {
        let receiptModal = document.getElementById('receipt-modal-container');
        if (!receiptModal) {
            receiptModal = document.createElement('div');
            receiptModal.id = 'receipt-modal-container';
            receiptModal.className = 'pstk-modal-backdrop';
            document.body.appendChild(receiptModal);
        }

        const formattedAmount = Number(record.amount).toLocaleString();

        receiptModal.innerHTML = `
            <div class="pstk-modal-dialog receipt-dialog">
                <div class="receipt-card-printable" id="printable-receipt-content">
                    <div class="receipt-header">
                        <div class="receipt-org-title">DEMOSMAK TUTORIAL</div>
                        <div class="receipt-org-sub">Centre for Academic Excellence & Examination Mastery</div>
                        <div class="receipt-address">12 Tutorial Way, Academic Crescent, Lagos State, Nigeria</div>
                        <div class="receipt-badge-verified">OFFICIAL DIGITAL RECEIPT</div>
                    </div>

                    <div class="receipt-divider"></div>

                    <div class="receipt-info-grid">
                        <div class="info-group">
                            <span class="label">Receipt Reference:</span>
                            <span class="value font-mono"><strong>${record.ref}</strong></span>
                        </div>
                        <div class="info-group">
                            <span class="label">Date & Time:</span>
                            <span class="value">${record.date} (Automated Verification)</span>
                        </div>
                        <div class="info-group">
                            <span class="label">Student Name:</span>
                            <span class="value"><strong>${student ? student.fullName : record.studentName || 'Student'}</strong></span>
                        </div>
                        <div class="info-group">
                            <span class="label">Student Reg ID:</span>
                            <span class="value font-mono">${student ? student.id : record.studentId || 'N/A'}</span>
                        </div>
                        <div class="info-group">
                            <span class="label">Academic Class / Grade:</span>
                            <span class="value">${student ? student.grade : record.grade || 'N/A'}</span>
                        </div>
                        <div class="info-group">
                            <span class="label">Payment Gateway:</span>
                            <span class="value">${record.channel || 'Paystack Instant'}</span>
                        </div>
                    </div>

                    <table class="receipt-table">
                        <thead>
                            <tr>
                                <th>Description / Item</th>
                                <th>Academic Term</th>
                                <th style="text-align: right;">Amount (NGN)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${record.description || 'Tuition Fee Payment'}</td>
                                <td>Term 1 / Academic Session</td>
                                <td style="text-align: right; font-weight: 700;">NGN ${formattedAmount}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th colspan="2" style="text-align: right;">TOTAL PAID:</th>
                                <th style="text-align: right; color: #059669; font-size: 1.1rem;">NGN ${formattedAmount}</th>
                            </tr>
                            ${student && student.financials ? `
                            <tr>
                                <td colspan="2" style="text-align: right; font-size: 0.85rem; color: #64748b;">Remaining Outstanding Balance:</td>
                                <td style="text-align: right; font-size: 0.85rem; font-weight: 600; color: #dc2626;">NGN ${Number(student.financials.outstandingBalance).toLocaleString()}</td>
                            </tr>
                            ` : ''}
                        </tfoot>
                    </table>

                    <div class="receipt-stamp-box">
                        <div class="digital-stamp">
                            <div class="stamp-circle">
                                <span>DEMOSMAK TUTORIAL</span>
                                <strong>VERIFIED</strong>
                                <span>PAYSTACK CONFIRMED</span>
                            </div>
                        </div>
                        <div class="stamp-auth">
                            <p>Authorised Bursary Signature</p>
                            <div class="auth-line">Bursar / Accounts Directorate</div>
                            <small>This is a computer-generated digital receipt and requires no physical ink signature.</small>
                        </div>
                    </div>
                </div>

                <div class="receipt-actions-footer">
                    <button type="button" class="btn btn-secondary" id="close-receipt-btn">Close</button>
                    <button type="button" class="btn btn-primary" id="print-receipt-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                        Print / Save PDF
                    </button>
                </div>
            </div>
        `;

        receiptModal.classList.add('visible');

        document.getElementById('close-receipt-btn').onclick = () => {
            receiptModal.classList.remove('visible');
        };

        document.getElementById('print-receipt-btn').onclick = () => {
            window.print();
        };
    }
}

window.demosmakPayment = new PaymentEngine();

