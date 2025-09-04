import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Database,
  Table,
  Key,
  Shield,
  Users,
  Lock,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface DatabaseManagementProps {
  onBack: () => void;
}

interface DatabaseTable {
  name: string;
  rows: number;
  columns: number;
  size: string;
  rls_enabled: boolean;
  policies: number;
}

export const DatabaseManagement: React.FC<DatabaseManagementProps> = ({
  onBack,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTable, setSelectedTable] = useState<string>('');

  const tables: DatabaseTable[] = [
    {
      name: 'prompts',
      rows: 45,
      columns: 7,
      size: '2.1 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'changelogs',
      rows: 23,
      columns: 7,
      size: '1.8 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'blueprint_snippets',
      rows: 67,
      columns: 10,
      size: '5.2 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'commits',
      rows: 12,
      columns: 9,
      size: '3.1 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'publications',
      rows: 8,
      columns: 8,
      size: '1.2 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'blueprint_files',
      rows: 15,
      columns: 7,
      size: '8.7 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'special_pages',
      rows: 5,
      columns: 11,
      size: '2.8 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'app_build_log',
      rows: 156,
      columns: 8,
      size: '4.3 MB',
      rls_enabled: true,
      policies: 2,
    },
    {
      name: 'feedback',
      rows: 34,
      columns: 7,
      size: '1.5 MB',
      rls_enabled: true,
      policies: 1,
    },
    {
      name: 'api_connections',
      rows: 4,
      columns: 8,
      size: '0.8 MB',
      rls_enabled: true,
      policies: 1,
    },
  ];

  const filteredTables = tables.filter(table =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRows = tables.reduce((sum, table) => sum + table.rows, 0);
  const totalSize = tables.reduce(
    (sum, table) => sum + parseFloat(table.size),
    0
  );
  const tablesWithRLS = tables.filter(table => table.rls_enabled).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='space-y-6'
    >
      {/* Header */}
      <div className='flex items-center space-x-4'>
        <Button variant='ghost' onClick={onBack}>
          <ArrowLeft className='w-4 h-4 mr-2' />
          Back to App Management
        </Button>
        <h1 className='text-2xl font-bold text-white'>Database Management</h1>
      </div>

      {/* Database Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        {[
          {
            label: 'Total Tables',
            value: tables.length.toString(),
            icon: Table,
            color: 'text-cyan-400',
          },
          {
            label: 'Total Rows',
            value: totalRows.toLocaleString(),
            icon: Database,
            color: 'text-purple-400',
          },
          {
            label: 'Storage Used',
            value: `${totalSize.toFixed(1)} MB`,
            icon: Database,
            color: 'text-green-400',
          },
          {
            label: 'RLS Enabled',
            value: `${tablesWithRLS}/${tables.length}`,
            icon: Shield,
            color: 'text-blue-400',
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className='bg-gray-800/30 rounded-lg p-4 border border-gray-700/30'
            >
              <div className='flex items-center space-x-3'>
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <div>
                  <div className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className='text-gray-400 text-xs'>{stat.label}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className='flex items-center space-x-4'>
        <Input
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder='Search tables...'
          className='w-64'
        />
        <Button variant='secondary' size='sm'>
          <Plus className='w-4 h-4 mr-2' />
          New Table
        </Button>
      </div>

      {/* Tables List */}
      <Card title='Database Tables' gradient>
        <div className='space-y-3'>
          {filteredTables.map((table, index) => (
            <motion.div
              key={table.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                selectedTable === table.name
                  ? 'border-cyan-400/50 bg-cyan-500/10'
                  : 'border-gray-700/30 bg-gray-800/30 hover:border-gray-600/50'
              }`}
              onClick={() => setSelectedTable(table.name)}
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-4'>
                  <div className='w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center'>
                    <Table className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <h4 className='text-white font-medium'>{table.name}</h4>
                    <div className='flex items-center space-x-4 text-xs text-gray-400'>
                      <span>{table.rows} rows</span>
                      <span>{table.columns} columns</span>
                      <span>{table.size}</span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='flex items-center space-x-2'>
                    {table.rls_enabled ? (
                      <div className='flex items-center space-x-1 text-green-400 text-xs'>
                        <Shield className='w-3 h-3' />
                        <span>RLS</span>
                      </div>
                    ) : (
                      <div className='flex items-center space-x-1 text-red-400 text-xs'>
                        <Lock className='w-3 h-3' />
                        <span>No RLS</span>
                      </div>
                    )}
                    <span className='text-xs text-gray-400'>
                      {table.policies} policies
                    </span>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Button variant='ghost' size='sm'>
                      <Eye className='w-3 h-3 mr-1' />
                      View
                    </Button>
                    <Button variant='ghost' size='sm'>
                      <Edit className='w-3 h-3 mr-1' />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Schema Actions */}
      <Card title='Schema Management'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <Button variant='secondary' className='justify-start'>
            <Plus className='w-4 h-4 mr-2' />
            Create Migration
          </Button>
          <Button variant='secondary' className='justify-start'>
            <Database className='w-4 h-4 mr-2' />
            Backup Schema
          </Button>
          <Button variant='secondary' className='justify-start'>
            <Shield className='w-4 h-4 mr-2' />
            Review Security
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
