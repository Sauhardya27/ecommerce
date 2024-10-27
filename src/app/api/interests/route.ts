import { NextResponse } from 'next/server'; 
import dbConnect from '@/lib/db';
import { Item } from '@/lib/models';

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    
    const skip = (page - 1) * pageSize;
    
    const total = await Item.countDocuments();
    
    const interests = await Item
      .find({})
      .sort({ id: 1 })
      .skip(skip)
      .limit(pageSize);
    
    const totalPages = Math.ceil(total / pageSize);
    
    return NextResponse.json({
      interests,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        pageSize
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interests' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { id, selected } = body;
    
    const updatedInterest = await Item.findOneAndUpdate(
      { id },
      { selected },
      { new: true }
    );
    
    if (!updatedInterest) {
      return NextResponse.json(
        { error: 'Interest not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedInterest);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update interest' },
      { status: 500 }
    );
  }
}