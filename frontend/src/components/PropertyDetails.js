import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  CardFooter,
  Divider,
  Chip,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';

function PropertyDetails({ property, tokenId, onUpdate, onRentUpdate, onTransfer }) {
  if (!property) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardBody>
          <p className="text-center">No property data available</p>
        </CardBody>
      </Card>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="flex justify-between">
        <div>
          <p className="text-lg font-bold">Property #{tokenId}</p>
          <p className="text-small text-default-500">{property.propertyAddress}</p>
        </div>
        <Chip color={property.isRented ? "success" : "default"}>
          {property.isRented ? "Rented" : "Not Rented"}
        </Chip>
      </CardHeader>
      <Divider />
      <CardBody>
        <Table removeWrapper aria-label="Property details">
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Property Type</TableCell>
              <TableCell>{property.propertyType}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Purchase Price</TableCell>
              <TableCell>{formatCurrency(property.purchasePrice)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Current Value</TableCell>
              <TableCell>{formatCurrency(property.currentValue)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Square Footage</TableCell>
              <TableCell>{property.squareFootage} sq ft</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Year Built</TableCell>
              <TableCell>{property.yearBuilt}</TableCell>
            </TableRow>
            {property.isRented && (
              <TableRow>
                <TableCell className="font-medium">Monthly Rental Income</TableCell>
                <TableCell>{formatCurrency(property.rentalIncome)}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell className="font-medium">Additional Details</TableCell>
              <TableCell>{property.additionalDetails}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Last Updated</TableCell>
              <TableCell>{property.lastUpdated}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardBody>
      <Divider />
      <CardFooter className="flex gap-2 justify-around">
        <Button color="primary" variant="flat" onClick={() => onUpdate(tokenId)}>
          Update Property
        </Button>
        <Button 
          color={property.isRented ? "danger" : "success"} 
          variant="flat"
          onClick={() => onRentUpdate(tokenId, !property.isRented)}
        >
          {property.isRented ? "End Rental" : "Set as Rented"}
        </Button>
        <Button color="warning" variant="flat" onClick={() => onTransfer(tokenId)}>
          Transfer Ownership
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PropertyDetails; 