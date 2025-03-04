import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Select, 
  SelectItem,
  Textarea,
  Divider
} from '@nextui-org/react';

const propertyTypes = [
  { label: "Residential - Single Family", value: "Residential - Single Family" },
  { label: "Residential - Multi Family", value: "Residential - Multi Family" },
  { label: "Residential - Condo", value: "Residential - Condo" },
  { label: "Commercial - Office", value: "Commercial - Office" },
  { label: "Commercial - Retail", value: "Commercial - Retail" },
  { label: "Commercial - Industrial", value: "Commercial - Industrial" },
  { label: "Land", value: "Land" },
];

function PropertyForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    propertyAddress: '',
    purchasePrice: '',
    currentValue: '',
    squareFootage: '',
    propertyType: '',
    yearBuilt: '',
    additionalDetails: '',
    ownerAddress: '',
    tokenURI: 'ipfs://QmDefault', // Default value, can be customized for image storage
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert numeric values
    const processedData = {
      ...formData,
      purchasePrice: formData.purchasePrice ? parseInt(formData.purchasePrice, 10) : 0,
      currentValue: formData.currentValue ? parseInt(formData.currentValue, 10) : 0,
      squareFootage: formData.squareFootage ? parseInt(formData.squareFootage, 10) : 0,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt, 10) : 0,
    };
    
    onSubmit(processedData);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-bold">Register New Property</p>
          <p className="text-small text-default-500">Enter your property details below</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Property Address"
            placeholder="123 Main St, City, State, Zip"
            value={formData.propertyAddress}
            onChange={(e) => handleChange('propertyAddress', e.target.value)}
            isRequired
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Price ($)"
              placeholder="300000"
              type="number"
              value={formData.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              isRequired
            />
            
            <Input
              label="Current Value ($)"
              placeholder="325000"
              type="number"
              value={formData.currentValue}
              onChange={(e) => handleChange('currentValue', e.target.value)}
              isRequired
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Square Footage"
              placeholder="2000"
              type="number"
              value={formData.squareFootage}
              onChange={(e) => handleChange('squareFootage', e.target.value)}
              isRequired
            />
            
            <Input
              label="Year Built"
              placeholder="2010"
              type="number"
              value={formData.yearBuilt}
              onChange={(e) => handleChange('yearBuilt', e.target.value)}
              isRequired
            />
          </div>
          
          <Select
            label="Property Type"
            placeholder="Select property type"
            value={formData.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value)}
            isRequired
          >
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
          
          <Textarea
            label="Additional Details"
            placeholder="3 bed, 2 bath, recently renovated..."
            value={formData.additionalDetails}
            onChange={(e) => handleChange('additionalDetails', e.target.value)}
          />
          
          <Input
            label="Owner Wallet Address"
            placeholder="0x..."
            value={formData.ownerAddress}
            onChange={(e) => handleChange('ownerAddress', e.target.value)}
            isRequired
          />
        </form>
      </CardBody>
      <Divider />
      <CardFooter>
        <Button 
          color="primary" 
          onClick={handleSubmit} 
          isLoading={isLoading}
          fullWidth
        >
          Register Property
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyForm; 