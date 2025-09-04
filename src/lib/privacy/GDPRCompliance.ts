/**
 * GDPR Compliance Implementation
 * 
 * Implements GDPR/AVG compliance features including:
 * - Consent management
 * - Data subject rights
 * - Data processing records
 * - Privacy policy management
 * - Data retention policies
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Consent types
 */
export enum ConsentType {
  NECESSARY = 'necessary',
  FUNCTIONAL = 'functional',
  ANALYTICS = 'analytics',
  MARKETING = 'marketing',
  THIRD_PARTY = 'third_party'
}

/**
 * Consent status
 */
export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
  WITHDRAWN = 'withdrawn'
}

/**
 * Data subject rights
 */
export enum DataSubjectRight {
  ACCESS = 'access',
  RECTIFICATION = 'rectification',
  ERASURE = 'erasure',
  PORTABILITY = 'portability',
  RESTRICTION = 'restriction',
  OBJECTION = 'objection',
  AUTOMATED_DECISION = 'automated_decision'
}

/**
 * Data processing purpose
 */
export enum ProcessingPurpose {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests'
}

/**
 * Consent record interface
 */
export interface ConsentRecord {
  id: string;
  userId: string;
  consentType: ConsentType;
  status: ConsentStatus;
  grantedAt?: Date;
  withdrawnAt?: Date;
  version: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Data processing record interface
 */
export interface DataProcessingRecord {
  id: string;
  purpose: ProcessingPurpose;
  description: string;
  legalBasis: string;
  dataCategories: string[];
  recipients: string[];
  retentionPeriod: string;
  securityMeasures: string[];
  timestamp: Date;
}

/**
 * Data subject request interface
 */
export interface DataSubjectRequest {
  id: string;
  userId: string;
  right: DataSubjectRight;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  submittedAt: Date;
  completedAt?: Date;
  response?: string;
}

/**
 * Privacy policy version interface
 */
export interface PrivacyPolicyVersion {
  id: string;
  version: string;
  effectiveDate: Date;
  content: string;
  changes: string[];
  approvedBy: string;
  approvedAt: Date;
}

/**
 * GDPR Compliance Manager
 */
export class GDPRComplianceManager {
  private consentRecords: Map<string, ConsentRecord[]> = new Map();
  private processingRecords: DataProcessingRecord[] = [];
  private dataSubjectRequests: DataSubjectRequest[] = [];
  private privacyPolicyVersions: PrivacyPolicyVersion[] = [];
  private logger: any;

  constructor(logger?: any) {
    this.logger = logger;
    this.initializeDefaultProcessingRecords();
  }

  /**
   * Initialize default data processing records
   */
  private initializeDefaultProcessingRecords(): void {
    this.processingRecords = [
      {
        id: uuidv4(),
        purpose: ProcessingPurpose.CONSENT,
        description: 'User consent management for cookies and tracking',
        legalBasis: 'Explicit consent from data subject',
        dataCategories: ['Consent preferences', 'IP address', 'User agent'],
        recipients: ['Internal systems only'],
        retentionPeriod: 'Until consent withdrawal or 2 years',
        securityMeasures: ['Encryption at rest', 'Access controls', 'Audit logging'],
        timestamp: new Date()
      },
      {
        id: uuidv4(),
        purpose: ProcessingPurpose.CONTRACT,
        description: 'Service provision and account management',
        legalBasis: 'Performance of contract',
        dataCategories: ['Account information', 'Service usage data', 'Payment information'],
        recipients: ['Internal systems', 'Payment processors'],
        retentionPeriod: 'Duration of contract + 7 years',
        securityMeasures: ['Encryption', 'Access controls', 'Regular backups'],
        timestamp: new Date()
      },
      {
        id: uuidv4(),
        purpose: ProcessingPurpose.LEGITIMATE_INTERESTS,
        description: 'Service improvement and analytics',
        legalBasis: 'Legitimate interests in improving services',
        dataCategories: ['Usage analytics', 'Performance metrics', 'Error logs'],
        recipients: ['Internal systems', 'Analytics providers'],
        retentionPeriod: '2 years',
        securityMeasures: ['Data anonymization', 'Access controls', 'Audit logging'],
        timestamp: new Date()
      }
    ];
  }

  /**
   * Record user consent
   * @param userId - User ID
   * @param consentType - Type of consent
   * @param status - Consent status
   * @param metadata - Additional metadata
   * @returns Consent record
   */
  recordConsent(
    userId: string,
    consentType: ConsentType,
    status: ConsentStatus,
    metadata: {
      ipAddress?: string;
      userAgent?: string;
      version?: string;
    } = {}
  ): ConsentRecord {
    const consentRecord: ConsentRecord = {
      id: uuidv4(),
      userId,
      consentType,
      status,
      grantedAt: status === ConsentStatus.GRANTED ? new Date() : undefined,
      withdrawnAt: status === ConsentStatus.WITHDRAWN ? new Date() : undefined,
      version: metadata.version || '1.0.0',
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      timestamp: new Date()
    };

    // Store consent record
    if (!this.consentRecords.has(userId)) {
      this.consentRecords.set(userId, []);
    }
    this.consentRecords.get(userId)!.push(consentRecord);

    // Log consent action
    this.logConsentAction(consentRecord);

    return consentRecord;
  }

  /**
   * Withdraw user consent
   * @param userId - User ID
   * @param consentType - Type of consent to withdraw
   * @returns Updated consent record
   */
  withdrawConsent(userId: string, consentType: ConsentType): ConsentRecord | null {
    const userConsents = this.consentRecords.get(userId);
    if (!userConsents) return null;

    const consent = userConsents.find(c => c.consentType === consentType);
    if (!consent) return null;

    // Update consent status
    consent.status = ConsentStatus.WITHDRAWN;
    consent.withdrawnAt = new Date();

    // Log withdrawal
    this.logConsentAction(consent);

    return consent;
  }

  /**
   * Get user consent status
   * @param userId - User ID
   * @param consentType - Type of consent
   * @returns Consent status
   */
  getConsentStatus(userId: string, consentType: ConsentType): ConsentStatus {
    const userConsents = this.consentRecords.get(userId);
    if (!userConsents) return ConsentStatus.PENDING;

    const latestConsent = userConsents
      .filter(c => c.consentType === consentType)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];

    return latestConsent?.status || ConsentStatus.PENDING;
  }

  /**
   * Check if user has given consent
   * @param userId - User ID
   * @param consentType - Type of consent
   * @returns True if consent is granted
   */
  hasConsent(userId: string, consentType: ConsentType): boolean {
    return this.getConsentStatus(userId, consentType) === ConsentStatus.GRANTED;
  }

  /**
   * Submit data subject request
   * @param userId - User ID
   * @param right - Data subject right
   * @param description - Request description
   * @returns Data subject request
   */
  submitDataSubjectRequest(
    userId: string,
    right: DataSubjectRight,
    description: string
  ): DataSubjectRequest {
    const request: DataSubjectRequest = {
      id: uuidv4(),
      userId,
      right,
      description,
      status: 'pending',
      submittedAt: new Date()
    };

    this.dataSubjectRequests.push(request);

    // Log request
    this.logDataSubjectRequest(request);

    return request;
  }

  /**
   * Process data subject request
   * @param requestId - Request ID
   * @param response - Response to the request
   * @param status - New status
   * @returns Updated request
   */
  processDataSubjectRequest(
    requestId: string,
    response: string,
    status: 'completed' | 'rejected' = 'completed'
  ): DataSubjectRequest | null {
    const request = this.dataSubjectRequests.find(r => r.id === requestId);
    if (!request) return null;

    request.status = status;
    request.response = response;
    request.completedAt = new Date();

    // Log processing
    this.logDataSubjectRequest(request);

    return request;
  }

  /**
   * Get user data for access request
   * @param userId - User ID
   * @returns User data summary
   */
  getUserDataSummary(userId: string): any {
    const userConsents = this.consentRecords.get(userId) || [];
    const userRequests = this.dataSubjectRequests.filter(r => r.userId === userId);

    return {
      userId,
      consents: userConsents.map(c => ({
        type: c.consentType,
        status: c.status,
        grantedAt: c.grantedAt,
        withdrawnAt: c.withdrawnAt
      })),
      dataSubjectRequests: userRequests.map(r => ({
        right: r.right,
        status: r.status,
        submittedAt: r.submittedAt,
        completedAt: r.completedAt
      })),
      dataCategories: this.getDataCategoriesForUser(userId),
      retentionPolicies: this.getRetentionPoliciesForUser(userId)
    };
  }

  /**
   * Add privacy policy version
   * @param version - Version number
   * @param content - Policy content
   * @param changes - List of changes
   * @param approvedBy - Approver name
   * @returns Privacy policy version
   */
  addPrivacyPolicyVersion(
    version: string,
    content: string,
    changes: string[],
    approvedBy: string
  ): PrivacyPolicyVersion {
    const policyVersion: PrivacyPolicyVersion = {
      id: uuidv4(),
      version,
      effectiveDate: new Date(),
      content,
      changes,
      approvedBy,
      approvedAt: new Date()
    };

    this.privacyPolicyVersions.push(policyVersion);

    // Log policy addition
    this.logPrivacyPolicyAction(policyVersion, 'added');

    return policyVersion;
  }

  /**
   * Get latest privacy policy
   * @returns Latest privacy policy version
   */
  getLatestPrivacyPolicy(): PrivacyPolicyVersion | null {
    if (this.privacyPolicyVersions.length === 0) return null;

    return this.privacyPolicyVersions
      .sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime())[0];
  }

  /**
   * Get data categories for user
   * @param userId - User ID
   * @returns Data categories
   */
  private getDataCategoriesForUser(userId: string): string[] {
    const userConsents = this.consentRecords.get(userId) || [];
    const categories = new Set<string>();

    // Add categories based on consents
    userConsents.forEach(consent => {
      if (consent.status === ConsentStatus.GRANTED) {
        switch (consent.consentType) {
          case ConsentType.ANALYTICS:
            categories.add('Usage Analytics');
            categories.add('Performance Metrics');
            break;
          case ConsentType.MARKETING:
            categories.add('Marketing Preferences');
            categories.add('Communication History');
            break;
          case ConsentType.FUNCTIONAL:
            categories.add('Functional Data');
            categories.add('User Preferences');
            break;
        }
      }
    });

    // Always include necessary categories
    categories.add('Account Information');
    categories.add('Service Usage Data');

    return Array.from(categories);
  }

  /**
   * Get retention policies for user
   * @param userId - User ID
   * @returns Retention policies
   */
  private getRetentionPoliciesForUser(userId: string): any[] {
    return this.processingRecords.map(record => ({
      purpose: record.purpose,
      description: record.description,
      retentionPeriod: record.retentionPeriod,
      dataCategories: record.dataCategories
    }));
  }

  /**
   * Log consent action
   * @param consent - Consent record
   */
  private logConsentAction(consent: ConsentRecord): void {
    if (this.logger) {
      this.logger.info('Consent action recorded', {
        userId: consent.userId,
        consentType: consent.consentType,
        status: consent.status,
        timestamp: consent.timestamp
      });
    }
  }

  /**
   * Log data subject request
   * @param request - Data subject request
   */
  private logDataSubjectRequest(request: DataSubjectRequest): void {
    if (this.logger) {
      this.logger.info('Data subject request processed', {
        requestId: request.id,
        userId: request.userId,
        right: request.right,
        status: request.status,
        timestamp: request.timestamp
      });
    }
  }

  /**
   * Log privacy policy action
   * @param policy - Privacy policy version
   * @param action - Action performed
   */
  private logPrivacyPolicyAction(policy: PrivacyPolicyVersion, action: string): void {
    if (this.logger) {
      this.logger.info(`Privacy policy ${action}`, {
        version: policy.version,
        approvedBy: policy.approvedBy,
        timestamp: policy.timestamp
      });
    }
  }

  /**
   * Get compliance report
   * @returns Compliance report
   */
  getComplianceReport(): any {
    const totalUsers = this.consentRecords.size;
    const totalRequests = this.dataSubjectRequests.length;
    const pendingRequests = this.dataSubjectRequests.filter(r => r.status === 'pending').length;

    return {
      timestamp: new Date(),
      userConsents: {
        total: totalUsers,
        byType: Object.values(ConsentType).map(type => ({
          type,
          count: Array.from(this.consentRecords.values())
            .flat()
            .filter(c => c.consentType === type && c.status === ConsentStatus.GRANTED).length
        }))
      },
      dataSubjectRequests: {
        total: totalRequests,
        pending: pendingRequests,
        byRight: Object.values(DataSubjectRight).map(right => ({
          right,
          count: this.dataSubjectRequests.filter(r => r.right === right).length
        }))
      },
      processingRecords: {
        total: this.processingRecords.length,
        byPurpose: Object.values(ProcessingPurpose).map(purpose => ({
          purpose,
          count: this.processingRecords.filter(r => r.purpose === purpose).length
        }))
      },
      privacyPolicy: {
        totalVersions: this.privacyPolicyVersions.length,
        latestVersion: this.getLatestPrivacyPolicy()?.version || 'None'
      }
    };
  }
}

export default GDPRComplianceManager;
