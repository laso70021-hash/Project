'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Customer,
  Driver,
  Invoice,
  PackageRecord,
  PickTask,
  Shipment,
  StorageBooking,
  StorageRack,
  Transporter,
  Vehicle,
  CycleCountRecord,
  QRScanHistory,
  UserRole,
} from './types';
import {
  initialCustomers,
  initialDrivers,
  initialInvoices,
  initialPackages,
  initialPickTasks,
  initialRacks,
  initialScanHistory,
  initialShipments,
  initialStorageBookings,
  initialTransporters,
  initialVehicles,
  initialCycleCounts,
} from './initial-data';

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole | 'landing';
  setCurrentRole: (role: UserRole | 'landing') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedWarehouse: string;
  setSelectedWarehouse: (wh: string) => void;

  // Data Collections
  customers: Customer[];
  shipments: Shipment[];
  packages: PackageRecord[];
  racks: StorageRack[];
  invoices: Invoice[];
  bookings: StorageBooking[];
  transporters: Transporter[];
  drivers: Driver[];
  vehicles: Vehicle[];
  pickTasks: PickTask[];
  cycleCounts: CycleCountRecord[];
  scanHistory: QRScanHistory[];

  // Mutators & Operations
  createShipment: (shipment: Partial<Shipment>) => Promise<Shipment>;
  updateShipmentStatus: (id: string, status: Shipment['status'], note?: string) => void;
  assignDriver: (shipmentId: string, driverId: string, vehiclePlate?: string) => void;
  confirmDelivery: (shipmentId: string, recipientName: string, signature?: string, photo?: string, notes?: string) => void;

  createStorageBooking: (booking: Partial<StorageBooking>) => StorageBooking;
  updateBookingStatus: (id: string, status: StorageBooking['status']) => void;

  receivePackageBatch: (packagesData: Partial<PackageRecord>[]) => Promise<PackageRecord[]>;
  confirmPutaway: (packageId: string, locationCode: string) => void;
  movePackage: (packageId: string, newLocationCode: string) => void;

  executePickItem: (taskId: string, packageId: string) => void;
  completePickTask: (taskId: string) => void;

  recordCycleScan: (packageId: string, scannedLocation: string) => { matched: boolean; details: any };
  recordPayment: (invoiceId: string, amount: number, paymentMethod: string, reference: string) => void;
  addQRScanLog: (entry: Omit<QRScanHistory, 'id' | 'timestamp'>) => void;

  generateQRDataUrl: (text: string) => Promise<string>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole | 'landing'>('admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('WH001 - Main Warehouse');

  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [packages, setPackages] = useState<PackageRecord[]>(initialPackages);
  const [racks, setRacks] = useState<StorageRack[]>(initialRacks);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [bookings, setBookings] = useState<StorageBooking[]>(initialStorageBookings);
  const [transporters, setTransporters] = useState<Transporter[]>(initialTransporters);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [pickTasks, setPickTasks] = useState<PickTask[]>(initialPickTasks);
  const [cycleCounts, setCycleCounts] = useState<CycleCountRecord[]>(initialCycleCounts);
  const [scanHistory, setScanHistory] = useState<QRScanHistory[]>(initialScanHistory);

  // Generate real QR code as data URL using `qrcode`
  const generateQRDataUrl = async (text: string): Promise<string> => {
    try {
      return await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
    } catch (e) {
      console.error('Error generating QR code:', e);
      return '';
    }
  };

  const createShipment = async (shipmentData: Partial<Shipment>): Promise<Shipment> => {
    const nextNum = 1043 + shipments.length;
    const trackingNumber = shipmentData.trackingNumber || `PKG-${nextNum}`;
    const qrCodeUrl = await generateQRDataUrl(trackingNumber);

    const newShipment: Shipment = {
      id: `s-${Date.now()}`,
      trackingNumber,
      referenceNumber: shipmentData.referenceNumber || `REF-2026-${shipments.length + 1}`,
      customerId: shipmentData.customerId || 'c-001',
      customerName: shipmentData.customerName || 'ABC Company',
      customerCode: shipmentData.customerCode || 'CUS-0001',
      customerPhone: shipmentData.customerPhone || '+255 712 345 678',
      customerEmail: shipmentData.customerEmail || 'info@abc.co.tz',
      serviceType: shipmentData.serviceType || 'Standard',
      priority: shipmentData.priority || 'Normal',
      origin: shipmentData.origin || 'Dar es Salaam',
      destination: shipmentData.destination || 'Zanzibar',
      pickupAddress: shipmentData.pickupAddress || 'Plot 45, Nyerere Road, Dar es Salaam',
      deliveryAddress: shipmentData.deliveryAddress || 'Kiponda Street, Zanzibar',
      pickupDate: shipmentData.pickupDate || new Date().toISOString(),
      expectedDeliveryDate: shipmentData.expectedDeliveryDate || new Date(Date.now() + 86400000 * 2).toISOString(),
      status: shipmentData.status || 'Pending Pickup',
      weightKg: shipmentData.weightKg || 25,
      totalVolumeM3: shipmentData.totalVolumeM3 || 0.12,
      assignedDriverId: shipmentData.assignedDriverId,
      assignedDriverName: shipmentData.assignedDriverName,
      assignedDriverPhone: shipmentData.assignedDriverPhone,
      assignedVehiclePlate: shipmentData.assignedVehiclePlate,
      baseFee: shipmentData.baseFee || 350000,
      storageFee: shipmentData.storageFee || 0,
      handlingFee: shipmentData.handlingFee || 50000,
      insuranceFee: shipmentData.insuranceFee || 5000,
      totalAmountTzs: shipmentData.totalAmountTzs || 405000,
      paymentStatus: shipmentData.paymentStatus || 'Pending',
      items: shipmentData.items || [{ id: 'i-1', name: 'General Cargo', quantity: 1, weightKg: shipmentData.weightKg || 25, valueTzs: 1000000 }],
      events: [
        {
          id: `e-${Date.now()}`,
          timestamp: new Date().toLocaleString(),
          title: 'Shipment Created',
          location: shipmentData.origin || 'Dar es Salaam',
          performedBy: 'Operations / Customer Portal',
          completed: true,
        },
      ],
      qrCodeUrl,
      category: shipmentData.category || 'General Goods',
      specialInstructions: shipmentData.specialInstructions,
    };

    setShipments(prev => [newShipment, ...prev]);

    // Also auto-generate an invoice for this shipment
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${428 + invoices.length + 1}`,
      customerId: newShipment.customerId,
      customerName: newShipment.customerName,
      type: 'Shipping',
      amountTzs: newShipment.totalAmountTzs,
      subtotalTzs: newShipment.totalAmountTzs,
      vatTzs: 0,
      issueDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      dueDate: new Date(Date.now() + 86400000 * 14).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      items: [
        { description: `Shipping service (${newShipment.origin} to ${newShipment.destination})`, quantity: 1, unitPriceTzs: newShipment.baseFee, amountTzs: newShipment.baseFee },
        { description: 'Handling & Processing', quantity: 1, unitPriceTzs: newShipment.handlingFee, amountTzs: newShipment.handlingFee },
      ],
    };
    setInvoices(prev => [newInvoice, ...prev]);

    return newShipment;
  };

  const updateShipmentStatus = (id: string, status: Shipment['status'], note?: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== id && s.trackingNumber !== id) return s;
        const newEvents = [
          ...s.events,
          {
            id: `e-${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            title: status,
            location: status === 'Delivered' ? s.destination : 'In Transit Hub',
            performedBy: s.assignedDriverName || 'Authorized Staff',
            completed: true,
            notes: note,
          },
        ];
        return {
          ...s,
          status,
          events: newEvents,
        };
      })
    );
  };

  const assignDriver = (shipmentId: string, driverId: string, vehiclePlate?: string) => {
    const driver = drivers.find(d => d.id === driverId || d.driverCode === driverId);
    if (!driver) return;

    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId && s.trackingNumber !== shipmentId) return s;
        return {
          ...s,
          assignedDriverId: driver.id,
          assignedDriverName: driver.name,
          assignedDriverPhone: driver.phone,
          assignedVehiclePlate: vehiclePlate || driver.currentVehiclePlate || 'TZ 1234 AB',
          status: s.status === 'Pending Pickup' ? 'Assigned' : s.status,
          events: [
            ...s.events,
            {
              id: `e-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              title: `Assigned to Driver: ${driver.name}`,
              location: 'Dispatch Center',
              performedBy: 'Operations Dispatcher',
              completed: true,
            },
          ],
        };
      })
    );
  };

  const confirmDelivery = (
    shipmentId: string,
    recipientName: string,
    signature?: string,
    photo?: string,
    notes?: string
  ) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id !== shipmentId && s.trackingNumber !== shipmentId) return s;
        return {
          ...s,
          status: 'Delivered',
          proofOfDelivery: {
            recipientName,
            signatureUrl: signature,
            photoUrl: photo,
            deliveredAt: new Date().toLocaleString(),
            notes: notes || 'Delivery completed and verified.',
          },
          events: [
            ...s.events,
            {
              id: `e-${Date.now()}`,
              timestamp: new Date().toLocaleString(),
              title: `Delivered (Received by: ${recipientName})`,
              location: s.destination,
              performedBy: s.assignedDriverName || 'Driver',
              completed: true,
              notes,
            },
          ],
        };
      })
    );
  };

  const createStorageBooking = (bookingData: Partial<StorageBooking>): StorageBooking => {
    const newBooking: StorageBooking = {
      id: `sb-${Date.now()}`,
      bookingNumber: `WHB-2026-${String(47 + bookings.length + 1).padStart(4, '0')}`,
      customerId: bookingData.customerId || 'c-001',
      customerName: bookingData.customerName || 'ABC Company',
      customerPhone: bookingData.customerPhone || '+255 712 345 678',
      warehouseCode: bookingData.warehouseCode || 'DAR-WH01',
      warehouseName: bookingData.warehouseName || 'Dar es Salaam (DAR-WH01)',
      expectedDate: bookingData.expectedDate || 'Tomorrow',
      itemsDescription: bookingData.itemsDescription || 'Packaged goods',
      cartonsCount: bookingData.cartonsCount || 20,
      status: 'Scheduled',
      receivedCartons: 0,
      monthlyRateTzs: (bookingData.cartonsCount || 20) * 15000,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    setBookings(prev => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: StorageBooking['status']) => {
    setBookings(prev => prev.map(b => (b.id === id || b.bookingNumber === id ? { ...b, status } : b)));
  };

  const receivePackageBatch = async (packagesData: Partial<PackageRecord>[]): Promise<PackageRecord[]> => {
    const created: PackageRecord[] = [];
    for (let i = 0; i < packagesData.length; i++) {
      const data = packagesData[i];
      const packageId = data.packageId || `PKG-${1042 + packages.length + i + 1}`;
      const qrCodeDataUrl = await generateQRDataUrl(packageId);

      const pkg: PackageRecord = {
        id: `p-${Date.now()}-${i}`,
        packageId,
        customerId: data.customerId || 'c-001',
        customerName: data.customerName || 'ABC Company',
        shipmentNumber: data.shipmentNumber || 'SHP-88321',
        bookingNumber: data.bookingNumber,
        productName: data.productName || 'General Cargo',
        category: data.category || 'General',
        weightKg: data.weightKg || 10,
        dimensions: data.dimensions || '40 x 30 x 20 cm',
        receivedAt: new Date().toLocaleString(),
        status: 'Awaiting Putaway',
        warehouseCode: 'WH001',
        lastMovedAt: new Date().toLocaleString(),
        qrCodeDataUrl,
        notes: data.notes,
      };
      created.push(pkg);
    }

    setPackages(prev => [...created, ...prev]);
    return created;
  };

  const confirmPutaway = (packageId: string, locationCode: string) => {
    // LocationCode format: WH001-A-R05-L02-B03
    const parts = locationCode.split('-');
    const zone = parts[1] || 'A';
    const rackCode = parts[2] || 'R05';
    const levelCode = parts[3] || 'L02';
    const binCode = parts[4] || 'B03';

    setPackages(prev =>
      prev.map(p => {
        if (p.packageId !== packageId && p.id !== packageId) return p;
        return {
          ...p,
          status: 'In Storage',
          currentLocationCode: locationCode,
          zone,
          rackCode,
          levelCode,
          binCode,
          lastMovedAt: new Date().toLocaleString(),
        };
      })
    );

    // Update rack bin load
    setRacks(prev =>
      prev.map(rack => {
        if (rack.rackCode !== rackCode) return rack;
        const updatedBins = rack.bins.map(bin => {
          if (bin.locationCode === locationCode) {
            return {
              ...bin,
              status: 'Occupied' as const,
              currentPackagesCount: bin.currentPackagesCount + 1,
              packageIds: Array.from(new Set([...bin.packageIds, packageId])),
              lastUpdated: new Date().toLocaleString(),
            };
          }
          return bin;
        });
        return {
          ...rack,
          bins: updatedBins,
        };
      })
    );

    addQRScanLog({
      scannedCode: packageId,
      type: 'Package',
      resultStatus: 'Found (In Storage)',
      scannedBy: 'Warehouse Staff',
      locationCode,
    });
  };

  const movePackage = (packageId: string, newLocationCode: string) => {
    confirmPutaway(packageId, newLocationCode);
  };

  const executePickItem = (taskId: string, packageId: string) => {
    setPickTasks(prev =>
      prev.map(task => {
        if (task.id !== taskId && task.taskNumber !== taskId) return task;
        const updatedItems = task.items.map(item => {
          if (item.packageId === packageId) {
            return {
              ...item,
              status: 'Picked' as const,
              pickedAt: new Date().toLocaleTimeString(),
              pickedBy: 'Warehouse Staff',
            };
          }
          return item;
        });
        const allPicked = updatedItems.every(i => i.status === 'Picked');
        return {
          ...task,
          items: updatedItems,
          status: allPicked ? 'Ready for Dispatch' : 'In Picking',
        };
      })
    );

    // Update package status to In Picking / Ready for Dispatch
    setPackages(prev =>
      prev.map(p => (p.packageId === packageId ? { ...p, status: 'In Picking', lastMovedAt: new Date().toLocaleString() } : p))
    );
  };

  const completePickTask = (taskId: string) => {
    setPickTasks(prev =>
      prev.map(t => (t.id === taskId || t.taskNumber === taskId ? { ...t, status: 'Completed' } : t))
    );
  };

  const recordCycleScan = (packageId: string, scannedLocation: string) => {
    const pkg = packages.find(p => p.packageId === packageId);
    const expectedLoc = pkg?.currentLocationCode || 'Unknown';
    const matched = expectedLoc === scannedLocation;

    const newRecord: CycleCountRecord = {
      id: `cc-${Date.now()}`,
      countNumber: 'CC-001',
      zone: scannedLocation.split('-')[1] || 'Zone A',
      locationCode: scannedLocation,
      zoneCode: scannedLocation.split('-')[1] || 'A',
      rackCode: scannedLocation.split('-')[2] || 'R05',
      levelCode: scannedLocation.split('-')[3] || 'L02',
      binCode: scannedLocation.split('-')[4] || 'B03',
      expectedPackages: 1,
      countedPackages: 1,
      status: matched ? 'Matched' : 'Discrepancy',
      lastScanned: new Date().toLocaleString(),
      scannedBy: 'Cycle Counter',
      expectedPackageId: packageId,
      foundPackageId: packageId,
      discrepancyType: matched ? undefined : 'Misplaced',
    };

    setCycleCounts(prev => [newRecord, ...prev]);

    return {
      matched,
      details: {
        packageId,
        expectedLocation: expectedLoc,
        currentScanLocation: scannedLocation,
        productName: pkg?.productName || 'Electronics (25 kg)',
      },
    };
  };

  const recordPayment = (invoiceId: string, amount: number, paymentMethod: string, reference: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id !== invoiceId && inv.invoiceNumber !== invoiceId) return inv;
        return {
          ...inv,
          status: 'Paid',
          paidAt: new Date().toLocaleString(),
          paymentMethod,
          paymentReference: reference,
        };
      })
    );
  };

  const addQRScanLog = (entry: Omit<QRScanHistory, 'id' | 'timestamp'>) => {
    const newLog: QRScanHistory = {
      id: `sh-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      ...entry,
    };
    setScanHistory(prev => [newLog, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        selectedWarehouse,
        setSelectedWarehouse,
        customers,
        shipments,
        packages,
        racks,
        invoices,
        bookings,
        transporters,
        drivers,
        vehicles,
        pickTasks,
        cycleCounts,
        scanHistory,
        createShipment,
        updateShipmentStatus,
        assignDriver,
        confirmDelivery,
        createStorageBooking,
        updateBookingStatus,
        receivePackageBatch,
        confirmPutaway,
        movePackage,
        executePickItem,
        completePickTask,
        recordCycleScan,
        recordPayment,
        addQRScanLog,
        generateQRDataUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
}

export const useApp = useAppStore;

