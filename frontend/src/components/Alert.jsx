import styles from '../styles/Alert.module.css';

function Alert({ isOpen, onClose, type, title, message, children }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'error':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
                    </svg>
                );
            case 'success':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1.177-7.86l-2.765-2.767L7 12.431l3.119 3.121 7.65-7.652L17.407 7l-6.584 6.584z" fill="currentColor"/>
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={styles.alertOverlay} onClick={onClose}>
            <div className={styles.alertContent} onClick={(e) => e.stopPropagation()}>
                <div className={`${styles.alertHeader} ${styles[type]}`}>
                    <div className={styles.alertIcon}>
                        {getIcon()}
                    </div>
                    <h3 className={styles.alertTitle}>{title}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                </div>
                <div className={styles.alertBody}>
                    <p className={styles.alertMessage}>{message}</p>
                    {children}
                </div>
                <div className={styles.alertFooter}>
                    <button 
                        className={`${styles.alertButton} ${styles[type + 'Button']}`}
                        onClick={onClose}
                    >
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Alert;