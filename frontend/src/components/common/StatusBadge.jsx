import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, RefreshCw, ShieldCheck, UserX } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const normalized = status ? status.toString().trim() : 'Approved';

  switch (normalized) {
    case 'Approved':
      return (
        <span className="badge badge-approved">
          <CheckCircle2 size={12} />
          Approved
        </span>
      );
    case 'Pending':
      return (
        <span className="badge badge-pending">
          <Clock size={12} />
          Pending
        </span>
      );
    case 'Declined':
    case 'Failed':
      return (
        <span className="badge badge-declined">
          <AlertTriangle size={12} />
          Declined
        </span>
      );
    case 'Refunded':
    case 'Partially Refunded':
      return (
        <span className="badge badge-refunded">
          <RefreshCw size={12} />
          {normalized}
        </span>
      );
    case 'active':
    case 'Active':
      return (
        <span className="badge badge-approved">
          <ShieldCheck size={12} />
          Active
        </span>
      );
    case 'inactive':
    case 'Inactive':
      return (
        <span className="badge badge-declined">
          <UserX size={12} />
          Inactive
        </span>
      );
    case 'admin':
    case 'Admin':
      return (
        <span className="badge badge-admin">
          Administrator
        </span>
      );
    case 'user':
    case 'User':
      return (
        <span className="badge badge-user">
          User
        </span>
      );
    default:
      return <span className="badge badge-user">{normalized}</span>;
  }
};

export default StatusBadge;
