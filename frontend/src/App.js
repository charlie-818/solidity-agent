import React, { useState, useEffect } from 'react';
import { 
  NextUIProvider, 
  Navbar, 
  NavbarBrand, 
  NavbarContent,
  Input,
  Button,
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Tabs, 
  Tab, 
  Card, 
  CardBody,
  Divider,
  useDisclosure
} from '@nextui-org/react';
import WalletConnect from './components/WalletConnect';
import PropertyForm from './components/PropertyForm';
import PropertyDetails from './components/PropertyDetails';
import contractInteraction from './utils/contractInteraction';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [contractConnected, setContractConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [tokenId, setTokenId] = useState('');
  const [viewTokenId, setViewTokenId] = useState('');
  const [rentalIncome, setRentalIncome] = useState('');
  const [transferAddress, setTransferAddress] = useState('');
  
  const { 
    isOpen: isUpdateModalOpen, 
    onOpen: onUpdateModalOpen, 
    onClose: onUpdateModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isRentModalOpen, 
    onOpen: onRentModalOpen, 
    onClose: onRentModalClose 
  } = useDisclosure();
  
  const { 
    isOpen: isTransferModalOpen, 
    onOpen: onTransferModalOpen, 
    onClose: onTransferModalClose 
  } = useDisclosure();

  const [updateData, setUpdateData] = useState({
    tokenId: '',
    currentValue: '',
    additionalDetails: ''
  });

  useEffect(() => {
    // Auto-connect to contract if address is in localStorage
    const savedAddress = localStorage.getItem('contractAddress');
    if (savedAddress) {
      setContractAddress(savedAddress);
      connectToContract(savedAddress);
    }
  }, []);

  const handleWalletConnection = (connected, address) => {
    setWalletConnected(connected);
  };

  const connectToContract = async (address) => {
    if (!address) {
      setError('Please enter a contract address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await contractInteraction.initialize(address);
      
      if (success) {
        setContractConnected(true);
        localStorage.setItem('contractAddress', address);
        setSuccessMessage('Connected to contract successfully!');
        
        // Clear message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError('Failed to connect to contract');
      }
    } catch (err) {
      console.error('Contract connection error:', err);
      setError(err.message || 'Failed to connect to contract');
    } finally {
      setIsLoading(false);
    }
  };

  const registerProperty = async (propertyData) => {
    if (!contractConnected) {
      setError('Please connect to a contract first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contractInteraction.registerProperty(propertyData);
      
      if (result.success) {
        setSuccessMessage(`Property registered successfully! Token ID: ${result.tokenId}`);
        setTokenId(result.tokenId.toString());
      } else {
        setError(result.error || 'Failed to register property');
      }
    } catch (err) {
      console.error('Property registration error:', err);
      setError(err.message || 'Failed to register property');
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyDetails = async () => {
    if (!contractConnected) {
      setError('Please connect to a contract first');
      return;
    }

    if (!viewTokenId) {
      setError('Please enter a token ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await contractInteraction.getPropertyDetails(viewTokenId);
      
      if (result.success) {
        setPropertyData(result.property);
      } else {
        setError(result.error || 'Failed to get property details');
        setPropertyData(null);
      }
    } catch (err) {
      console.error('Error fetching property details:', err);
      setError(err.message || 'Failed to get property details');
      setPropertyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProperty = (tokenId) => {
    setUpdateData({
      tokenId,
      currentValue: propertyData.currentValue,
      additionalDetails: propertyData.additionalDetails
    });
    onUpdateModalOpen();
  };

  const submitUpdateProperty = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contractInteraction.updateProperty(
        updateData.tokenId,
        parseInt(updateData.currentValue, 10),
        updateData.additionalDetails
      );
      
      if (result.success) {
        setSuccessMessage('Property updated successfully!');
        onUpdateModalClose();
        
        // Refresh property data
        getPropertyDetails();
      } else {
        setError(result.error || 'Failed to update property');
      }
    } catch (err) {
      console.error('Property update error:', err);
      setError(err.message || 'Failed to update property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentUpdate = (tokenId, isRented) => {
    setUpdateData({
      ...updateData,
      tokenId
    });
    setRentalIncome(propertyData.rentalIncome || '');
    onRentModalOpen();
  };

  const submitRentUpdate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contractInteraction.setRentalStatus(
        updateData.tokenId,
        !propertyData.isRented,
        parseInt(rentalIncome, 10) || 0
      );
      
      if (result.success) {
        setSuccessMessage(`Property ${propertyData.isRented ? 'no longer rented' : 'now rented'}!`);
        onRentModalClose();
        
        // Refresh property data
        getPropertyDetails();
      } else {
        setError(result.error || 'Failed to update rental status');
      }
    } catch (err) {
      console.error('Rental status update error:', err);
      setError(err.message || 'Failed to update rental status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransfer = (tokenId) => {
    setUpdateData({
      ...updateData,
      tokenId
    });
    setTransferAddress('');
    onTransferModalOpen();
  };

  const submitTransfer = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await contractInteraction.transferProperty(
        updateData.tokenId,
        transferAddress
      );
      
      if (result.success) {
        setSuccessMessage('Property transferred successfully!');
        onTransferModalClose();
        
        // Refresh property data
        getPropertyDetails();
      } else {
        setError(result.error || 'Failed to transfer property');
      }
    } catch (err) {
      console.error('Property transfer error:', err);
      setError(err.message || 'Failed to transfer property');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Navbar maxWidth="xl">
          <NavbarBrand>
            <p className="font-bold text-xl">Real Estate Portfolio</p>
          </NavbarBrand>
          <NavbarContent justify="end">
            <WalletConnect onConnected={handleWalletConnection} />
          </NavbarContent>
        </Navbar>

        <main className="container mx-auto px-4 py-8">
          {!contractConnected ? (
            <Card className="max-w-lg mx-auto mb-8">
              <CardBody className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Connect to Contract</h2>
                <div className="flex gap-2">
                  <Input
                    label="Contract Address"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="flex-grow"
                  />
                  <Button 
                    color="primary" 
                    isLoading={isLoading}
                    onClick={() => connectToContract(contractAddress)}
                  >
                    Connect
                  </Button>
                </div>
                {error && <p className="text-danger">{error}</p>}
                {successMessage && <p className="text-success">{successMessage}</p>}
              </CardBody>
            </Card>
          ) : (
            <Tabs aria-label="Real Estate Portfolio Options" className="mb-8">
              <Tab key="register" title="Register Property">
                <Card>
                  <CardBody>
                    <PropertyForm 
                      onSubmit={registerProperty} 
                      isLoading={isLoading} 
                    />
                    {error && <p className="text-danger mt-4">{error}</p>}
                    {successMessage && (
                      <div className="mt-4 p-3 bg-success-50 text-success rounded-md">
                        {successMessage}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="view" title="View Property">
                <Card>
                  <CardBody>
                    <div className="flex gap-2 mb-6">
                      <Input
                        label="Property Token ID"
                        placeholder="Enter token ID to view property"
                        value={viewTokenId}
                        onChange={(e) => setViewTokenId(e.target.value)}
                        className="flex-grow"
                      />
                      <Button 
                        color="primary" 
                        isLoading={isLoading}
                        onClick={getPropertyDetails}
                      >
                        View
                      </Button>
                    </div>
                    
                    <Divider className="my-4" />
                    
                    {propertyData && (
                      <PropertyDetails 
                        property={propertyData} 
                        tokenId={viewTokenId}
                        onUpdate={handleUpdateProperty}
                        onRentUpdate={handleRentUpdate}
                        onTransfer={handleTransfer}
                      />
                    )}
                    
                    {error && <p className="text-danger mt-4">{error}</p>}
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          )}
        </main>
        
        {/* Update Property Modal */}
        <Modal isOpen={isUpdateModalOpen} onClose={onUpdateModalClose}>
          <ModalContent>
            <ModalHeader>Update Property</ModalHeader>
            <ModalBody>
              <Input
                label="Current Value ($)"
                placeholder="325000"
                type="number"
                value={updateData.currentValue}
                onChange={(e) => setUpdateData({...updateData, currentValue: e.target.value})}
                className="mb-4"
              />
              <Input
                label="Additional Details"
                placeholder="3 bed, 2 bath, recently renovated..."
                value={updateData.additionalDetails}
                onChange={(e) => setUpdateData({...updateData, additionalDetails: e.target.value})}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onUpdateModalClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={submitUpdateProperty} isLoading={isLoading}>
                Update
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Rent Status Modal */}
        <Modal isOpen={isRentModalOpen} onClose={onRentModalClose}>
          <ModalContent>
            <ModalHeader>
              {propertyData?.isRented ? "End Rental Agreement" : "Set Property as Rented"}
            </ModalHeader>
            <ModalBody>
              {!propertyData?.isRented && (
                <Input
                  label="Monthly Rental Income ($)"
                  placeholder="2500"
                  type="number"
                  value={rentalIncome}
                  onChange={(e) => setRentalIncome(e.target.value)}
                />
              )}
              {propertyData?.isRented ? (
                <p>Are you sure you want to mark this property as no longer rented?</p>
              ) : (
                <p className="mt-4">Confirm that this property is now being rented.</p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onRentModalClose}>
                Cancel
              </Button>
              <Button 
                color={propertyData?.isRented ? "danger" : "success"} 
                onPress={submitRentUpdate} 
                isLoading={isLoading}
              >
                {propertyData?.isRented ? "End Rental" : "Confirm Rental"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        
        {/* Transfer Property Modal */}
        <Modal isOpen={isTransferModalOpen} onClose={onTransferModalClose}>
          <ModalContent>
            <ModalHeader>Transfer Property Ownership</ModalHeader>
            <ModalBody>
              <Input
                label="New Owner Address"
                placeholder="0x..."
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
              />
              <p className="mt-4 text-warning">
                Warning: This will permanently transfer ownership of this property. This action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onTransferModalClose}>
                Cancel
              </Button>
              <Button color="warning" onPress={submitTransfer} isLoading={isLoading}>
                Transfer Ownership
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </NextUIProvider>
  );
}

export default App; 